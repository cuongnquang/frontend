'use client';
import { useState } from "react";
import { schedules, weeklyTemplate } from "../data";
import { SchedulePageHeader } from "@/components/doctor/schedules/SchedulePageHeader";
import { ScheduleStats } from "@/components/doctor/schedules/ScheduleStats";
import { ScheduleForm } from "@/components/doctor/schedules/ScheduleForm";
import { ScheduleList } from "@/components/doctor/schedules/ScheduleList";
import { WeeklyTemplateEditor } from "@/components/doctor/schedules/WeeklyTemplateEditor";

export default function SchedulePage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  
  const handleEditClick = (schedule) => {
    setEditingSchedule(schedule);
    setShowAddForm(true);
  };

  const handleAddClick = () => {
    setEditingSchedule(null);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setEditingSchedule(null);
    setShowAddForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log("Form submitted:", data);
    handleCloseForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch này?")) {
      console.log("Delete schedule:", id);
      // Logic to update state would go here
    }
  };

  return (
    <div className="space-y-6 p-6">
      <SchedulePageHeader onAddScheduleClick={handleAddClick} />
      
      <ScheduleStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {showAddForm && (
          <div className="lg:col-span-1">
            <ScheduleForm 
              editingSchedule={editingSchedule}
              onSubmit={handleSubmit}
              onClose={handleCloseForm}
            />
          </div>
        )}

        <div className={showAddForm ? "lg:col-span-2" : "lg:col-span-3"}>
          <ScheduleList 
            schedules={schedules}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            onAddSchedule={handleAddClick}
          />
        </div>
      </div>

      <WeeklyTemplateEditor template={weeklyTemplate} />
    </div>
  );
}