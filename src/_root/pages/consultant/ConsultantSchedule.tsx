import React from 'react'
import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';

const ConsultantSchedule = () => {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState("VIDEO");
  const [recurring, setRecurring] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const consultantId = '';

  useEffect(() => {
    axios.get(`/consultants/${consultantId}/availability`)
      .then(res => setSlots(res.data))
      .catch(err => console.error(err));
  }, [consultantId]);

  const handleSlotCreate = async () => {
    await axios.post(`/consultants/${consultantId}/availability`, {
      startTime: new Date(`${selectedDate}T${startTime}`),
      endTime: new Date(`${selectedDate}T${endTime}`),
      channel,
      recurring,
      recurrenceRule: recurring ? recurrenceRule : null,
    });
    setOpen(false);
    setStartTime("");
    setEndTime("");
    setRecurring(false);
    setRecurrenceRule("");
    const res = await axios.get(`/consultants/${consultantId}/availability`);
    setSlots(res.data);
  };
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Manage Availability</h2>
      <Calendar
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="border rounded-md"
      />
      <Button className="mt-4" onClick={() => setOpen(true)} disabled={!selectedDate}>
        Add Availability
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Availability</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="Start time" />
            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="End time" />

            <Select value={channel} onValueChange={setChannel}>
              <SelectItem value="VOICE">Voice</SelectItem>
              <SelectItem value="CHAT">Chat</SelectItem>
              <SelectItem value="VIDEO">Video</SelectItem>
              <SelectItem value="IN_PERSON">In Person</SelectItem>
            </Select>

            <div className="flex items-center gap-2">
              <Checkbox checked={recurring} onCheckedChange={() => setRecurring(true)} />
              <label>Recurring</label>
            </div>

            {recurring && (
              <Input
                value={recurrenceRule}
                onChange={(e) => setRecurrenceRule(e.target.value)}
                placeholder="e.g., FREQ=WEEKLY;BYDAY=MO,WE"
              />
            )}

            <Button onClick={handleSlotCreate} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-6">
        <h3 className="text-lg font-medium">Upcoming Slots</h3>
        <ul className="mt-2 space-y-2">
          {slots.map(slot => (
            <li key={slot.id} className="border rounded p-2">
              <div><strong>{slot.channel}</strong> — {format(new Date(slot.startTime), 'PPpp')} to {format(new Date(slot.endTime), 'PPpp')}</div>
              {slot.recurring && <div className="text-sm text-muted-foreground">Recurring: {slot.recurrenceRule}</div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ConsultantSchedule;

