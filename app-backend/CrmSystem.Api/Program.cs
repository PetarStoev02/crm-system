using CrmSystem.Application.Services;
using CrmSystem.Core.Entities;
using CrmSystem.Infrastructure.Data;
using Task = System.Threading.Tasks.Task;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using CrmSystem.Api;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Identity
builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!))
    };
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add controllers with JSON configuration
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.Converters.Add(new DateTimeJsonConverter());
        options.JsonSerializerOptions.Converters.Add(new NullableDateTimeJsonConverter());
    });

// Add application services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IDashboardService, CrmSystem.Infrastructure.Services.ConcreteDashboardService>();

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "CRM System API",
        Version = "v1"
    });

    // Add JWT authentication to Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed database with default user
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await SeedDatabase(services);
}

app.Run();

static async Task SeedDatabase(IServiceProvider services)
{
    var context = services.GetRequiredService<AppDbContext>();
    var userManager = services.GetRequiredService<UserManager<User>>();

    // Run pending migrations
    await context.Database.MigrateAsync();

    // Check if default user exists
    var defaultUser = await userManager.FindByEmailAsync("user1@test.test");
    if (defaultUser == null)
    {
        var user = new User
        {
            UserName = "user1@test.test",
            Email = "user1@test.test",
            FirstName = "Test",
            LastName = "User",
            EmailConfirmed = true,
            IsActive = true
        };

        var result = await userManager.CreateAsync(user, "password");
        if (result.Succeeded)
        {
            Console.WriteLine("Default user created successfully: user1@test.test / password");
            
            // Add sample tasks for the default user
            if (!context.Tasks.Any())
            {
                var sampleTasks = new[]
                {
                    new CrmSystem.Core.Entities.Task
                    {
                        Title = "Review Q2 campaign performance",
                        Description = "Analyze metrics and prepare summary report for stakeholders",
                        Status = "In Progress",
                        Priority = "High",
                        DueDate = DateTime.UtcNow.AddDays(7),
                        AssignedToUserId = user.Id,
                        CreatedByUserId = user.Id,
                        CreatedAt = DateTime.UtcNow
                    },
                    new CrmSystem.Core.Entities.Task
                    {
                        Title = "Client presentation preparation",
                        Description = "Prepare slides for TechCorp quarterly review meeting",
                        Status = "Pending",
                        Priority = "Medium",
                        DueDate = DateTime.UtcNow.AddDays(4),
                        AssignedToUserId = user.Id,
                        CreatedByUserId = user.Id,
                        CreatedAt = DateTime.UtcNow
                    },
                    new CrmSystem.Core.Entities.Task
                    {
                        Title = "Send weekly performance report",
                        Description = "Weekly summary of all active campaigns and leads",
                        Status = "Completed",
                        Priority = "Medium",
                        DueDate = DateTime.UtcNow.AddDays(-2),
                        CompletedAt = DateTime.UtcNow.AddDays(-1),
                        AssignedToUserId = user.Id,
                        CreatedByUserId = user.Id,
                        CreatedAt = DateTime.UtcNow.AddDays(-7)
                    }
                };

                context.Tasks.AddRange(sampleTasks);
                await context.SaveChangesAsync();
                Console.WriteLine("Sample tasks created successfully");
            }
        }
    }
}
