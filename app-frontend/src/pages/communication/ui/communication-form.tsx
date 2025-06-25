import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Mail,
  Phone,
  Video,
  MessageSquare,
  Save,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { communicationsAPI } from "@/lib/communications-api";
import type {
  CreateCommunicationRequest,
  Communication,
} from "@/lib/communications-api";
import { clientsAPI, type Client } from "@/lib/clients-api";
import { leadsAPI, type Lead } from "@/lib/leads-api";

interface CommunicationFormProps {
  communication?: Communication;
  onSuccess?: () => void;
  onCancel?: () => void;
  trigger?: React.ReactNode;
  isDialog?: boolean;
}

export function CommunicationForm({
  communication,
  onSuccess,
  onCancel,
  trigger,
  isDialog = true,
}: CommunicationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    type: communication?.type || "Email",
    subject: communication?.subject || "",
    content: communication?.content || "",
    direction: communication?.direction || "Outbound",
    status: communication?.status || "Sent",
    priority: communication?.priority || "Medium",
    communicationDate: communication?.communicationDate
      ? new Date(communication.communicationDate)
      : new Date(),
    followUpDate: communication?.followUpDate
      ? new Date(communication.followUpDate)
      : undefined,
    notes: communication?.notes || "",
    tags: communication?.tags || "",
    clientId: communication?.clientId || undefined,
    leadId: communication?.leadId || undefined,
    duration: communication?.duration || "",
    location: communication?.location || "",
    attendees: communication?.attendees || "",
  });

  useEffect(() => {
    if (isOpen) {
      loadClientsAndLeads();
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadClientsAndLeads = async () => {
    try {
      const [clientsResponse, leadsResponse] = await Promise.all([
        clientsAPI.getClients({ pageSize: 100 }),
        leadsAPI.getLeads({ limit: 100 }),
      ]);
      setClients(clientsResponse.clients);
      setLeads(leadsResponse.leads);
    } catch (error) {
      console.error("Failed to load clients and leads:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const requestData: CreateCommunicationRequest = {
        type: formData.type,
        subject: formData.subject,
        content: formData.content,
        direction: formData.direction,
        status: formData.status,
        priority: formData.priority,
        communicationDate: formData.communicationDate.toISOString(),
        followUpDate: formData.followUpDate?.toISOString(),
        notes: formData.notes,
        tags: formData.tags,
        clientId: formData.clientId,
        leadId: formData.leadId,
        duration: formData.duration || undefined,
        location: formData.location || undefined,
        attendees: formData.attendees || undefined,
      };

      if (communication) {
        await communicationsAPI.updateCommunication(communication.id, {
          ...requestData,
          isRead: communication.isRead,
        });
      } else {
        await communicationsAPI.createCommunication(requestData);
      }

      onSuccess?.();
      setIsOpen(false);

      // Reset form if creating new
      if (!communication) {
        setFormData({
          type: "Email",
          subject: "",
          content: "",
          direction: "Outbound",
          status: "Sent",
          priority: "Medium",
          communicationDate: new Date(),
          followUpDate: undefined,
          notes: "",
          tags: "",
          clientId: undefined,
          leadId: undefined,
          duration: "",
          location: "",
          attendees: "",
        });
      }
      setErrors({});
    } catch (error) {
      console.error("Failed to save communication:", error);
      alert("Failed to save communication. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | number | Date | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Email":
        return <Mail className="w-4 h-4" />;
      case "Call":
        return <Phone className="w-4 h-4" />;
      case "Meeting":
        return <Video className="w-4 h-4" />;
      case "SMS":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

      const formContent = (
      <Card className="w-full max-w-none mx-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getTypeIcon(formData.type)}
            {communication ? "Edit Communication" : "New Communication"}
          </CardTitle>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Communication Type & Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Communication Details
            </h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </div>
                    </SelectItem>
                    <SelectItem value="Call">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Call
                      </div>
                    </SelectItem>
                    <SelectItem value="Meeting">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Meeting
                      </div>
                    </SelectItem>
                    <SelectItem value="SMS">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        SMS
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direction">Direction</Label>
                <Select
                  value={formData.direction}
                  onValueChange={(value) =>
                    handleInputChange("direction", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Outbound">Outbound</SelectItem>
                    <SelectItem value="Inbound">Inbound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Communication subject"
                disabled={loading}
              />
              {errors.subject && (
                <p className="text-sm text-red-600">{errors.subject}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Contact Information
            </h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="space-y-2">
                 <Label>Client</Label>
                <Select
                  value={formData.clientId?.toString() || "none"}
                  onValueChange={(value) =>
                    handleInputChange(
                      "clientId",
                      value && value !== "none" ? parseInt(value) : undefined
                    )
                  }
                  disabled={!!formData.leadId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No client</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.firstName} {client.lastName} - {client.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Lead</Label>
                <Select
                  value={formData.leadId?.toString() || "none"}
                  onValueChange={(value) =>
                    handleInputChange(
                      "leadId",
                      value && value !== "none" ? parseInt(value) : undefined
                    )
                  }
                  disabled={!!formData.clientId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No lead</SelectItem>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id.toString()}>
                        {lead.firstName} {lead.lastName} - {lead.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Status & Priority */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Status & Priority
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sent">Sent</SelectItem>
                    <SelectItem value="Received">Received</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleInputChange("priority", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Communication Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.communicationDate && "text-muted-foreground"
                      )}
                      disabled={loading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.communicationDate
                        ? format(formData.communicationDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.communicationDate}
                      onSelect={(date) =>
                        handleInputChange(
                          "communicationDate",
                          date || new Date()
                        )
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Content</h3>
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Communication content"
                rows={4}
                disabled={loading}
              />
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content}</p>
              )}
            </div>
          </div>

          {/* Additional Information for Calls and Meetings */}
          {(formData.type === "Call" || formData.type === "Meeting") && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange("duration", e.target.value)
                    }
                    placeholder="e.g., 30 minutes"
                    disabled={loading}
                  />
                </div>
                {formData.type === "Meeting" && (
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="Meeting location or URL"
                      disabled={loading}
                    />
                  </div>
                )}
              </div>
              {formData.type === "Meeting" && (
                <div className="space-y-2">
                  <Label htmlFor="attendees">Attendees</Label>
                  <Input
                    id="attendees"
                    value={formData.attendees}
                    onChange={(e) =>
                      handleInputChange("attendees", e.target.value)
                    }
                    placeholder="List of attendees"
                    disabled={loading}
                  />
                </div>
              )}
            </div>
          )}

          {/* Notes & Follow-up */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Notes & Follow-up
            </h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  placeholder="Comma-separated tags"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label>Follow-up Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.followUpDate && "text-muted-foreground"
                      )}
                      disabled={loading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.followUpDate
                        ? format(formData.followUpDate, "PPP")
                        : "Pick a date (optional)"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.followUpDate}
                      onSelect={(date) =>
                        handleInputChange("followUpDate", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes"
                rows={3}
                disabled={loading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                onCancel?.();
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {communication ? "Update Communication" : "Create Communication"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  if (isDialog && trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
                 <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="sr-only">
              {communication ? "Edit Communication" : "New Communication"}
            </DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return formContent;
}
