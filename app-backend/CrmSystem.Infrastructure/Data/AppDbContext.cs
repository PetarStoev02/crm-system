using CrmSystem.Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Task = CrmSystem.Core.Entities.Task;

namespace CrmSystem.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<User>
{
    public DbSet<Lead> Leads { get; set; }
    public DbSet<Campaign> Campaigns { get; set; }
    public DbSet<Task> Tasks { get; set; }
    public DbSet<Client> Clients { get; set; }
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<InvoiceItem> InvoiceItems { get; set; }
    public DbSet<Communication> Communications { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(e => e.FirstName)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.LastName)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
        });

        // Configure Lead entity
        modelBuilder.Entity<Lead>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.FirstName)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.LastName)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.Company)
                .HasMaxLength(200);

            entity.Property(e => e.Phone)
                .HasMaxLength(20);

            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(e => e.Priority)
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(e => e.Source)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.EstimatedValue)
                .HasColumnType("decimal(18,2)");

            entity.HasOne(e => e.AssignedToUser)
                .WithMany()
                .HasForeignKey(e => e.AssignedToUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Campaign entity
        modelBuilder.Entity<Campaign>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(e => e.Type)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(e => e.Budget)
                .HasColumnType("decimal(18,2)");

            entity.Property(e => e.Spent)
                .HasColumnType("decimal(18,2)");

            entity.HasOne(e => e.CreatedByUser)
                .WithMany()
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Task entity
        modelBuilder.Entity<Task>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(e => e.Priority)
                .HasMaxLength(20)
                .IsRequired();

            entity.HasOne(e => e.AssignedToUser)
                .WithMany()
                .HasForeignKey(e => e.AssignedToUserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.CreatedByUser)
                .WithMany()
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.RelatedLead)
                .WithMany()
                .HasForeignKey(e => e.RelatedLeadId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.RelatedCampaign)
                .WithMany()
                .HasForeignKey(e => e.RelatedCampaignId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Client configuration
        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Company).HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.Address).HasMaxLength(200);
            entity.Property(e => e.City).HasMaxLength(50);
            entity.Property(e => e.State).HasMaxLength(50);
            entity.Property(e => e.PostalCode).HasMaxLength(20);
            entity.Property(e => e.Country).HasMaxLength(50);
            entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(20);
            entity.Property(e => e.TotalValue).HasPrecision(18, 2);
            entity.Property(e => e.OutstandingBalance).HasPrecision(18, 2);
            entity.Property(e => e.AssignedToUserId).IsRequired();

            entity.HasOne(e => e.AssignedToUser)
                .WithMany()
                .HasForeignKey(e => e.AssignedToUserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(e => e.Invoices)
                .WithOne(i => i.Client)
                .HasForeignKey(i => i.ClientId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Invoice configuration
        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.InvoiceNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
            entity.Property(e => e.SubTotal).HasPrecision(18, 2);
            entity.Property(e => e.TaxRate).HasPrecision(5, 2);
            entity.Property(e => e.TaxAmount).HasPrecision(18, 2);
            entity.Property(e => e.Total).HasPrecision(18, 2);
            entity.Property(e => e.AmountPaid).HasPrecision(18, 2);
            entity.Property(e => e.AmountDue).HasPrecision(18, 2);
            entity.Property(e => e.Currency).IsRequired().HasMaxLength(10);
            entity.Property(e => e.PaymentMethod).HasMaxLength(50);
            entity.Property(e => e.CreatedByUserId).IsRequired();

            entity.HasOne(e => e.Client)
                .WithMany(c => c.Invoices)
                .HasForeignKey(e => e.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.CreatedByUser)
                .WithMany()
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(e => e.Items)
                .WithOne(i => i.Invoice)
                .HasForeignKey(i => i.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // InvoiceItem configuration
        modelBuilder.Entity<InvoiceItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Description).IsRequired().HasMaxLength(500);
            entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
            entity.Property(e => e.Total).HasPrecision(18, 2);

            entity.HasOne(e => e.Invoice)
                .WithMany(i => i.Items)
                .HasForeignKey(e => e.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
        });

        // Communication configuration
        modelBuilder.Entity<Communication>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Subject).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Content).HasMaxLength(5000);
            entity.Property(e => e.Direction).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Priority).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Notes).HasMaxLength(2000);
            entity.Property(e => e.Tags).HasMaxLength(500);
            entity.Property(e => e.Duration).HasMaxLength(100);
            entity.Property(e => e.Location).HasMaxLength(500);
            entity.Property(e => e.Attendees).HasMaxLength(1000);
            entity.Property(e => e.UserId).IsRequired();

            entity.HasOne(e => e.Client)
                .WithMany()
                .HasForeignKey(e => e.ClientId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Lead)
                .WithMany()
                .HasForeignKey(e => e.LeadId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
} 