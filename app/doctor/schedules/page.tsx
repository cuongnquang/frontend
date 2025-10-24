'use client';

import { useState, useEffect } from "react";
import { useSchedule } from "@/contexts/ScheduleContext";
import { useAuth } from "@/contexts/AuthContext";
import { SchedulePageHeader } from "@/components/doctor/schedules/SchedulePageHeader";
import { ScheduleStats } from "@/components/doctor/schedules/ScheduleStats";
import { ScheduleForm } from "@/components/doctor/schedules/ScheduleForm";
import { ScheduleList } from "@/components/doctor/schedules/ScheduleList";
import { WeeklyTemplateEditor } from "@/components/doctor/schedules/WeeklyTemplateEditor";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Alert } from "@/components/ui/InlineAlert"

export default function SchedulePage() {
  const { user } = useAuth();
  const { schedules, loading, error, fetchSchedules, createSchedule, createManySchedules, deleteSchedule } = useSchedule();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleEditClick = (schedule: any) => {
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
    setSuccessMessage(null);
  };

  const handleSubmit = async (schedules: Array<{ schedule_date: string; start_time: string; end_time: string }>) => {
    try {
      let result;
      if (schedules.length === 1) {
        result = await createSchedule(schedules[0]);
      } else {
        result = await createManySchedules(schedules);
      }
      
      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          handleCloseForm();
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch này?")) {
      try {
        const result = await deleteSchedule(id);
        if (result.success) {
          setSuccessMessage(result.message);
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const handleCreateManySchedules = async (schedulesData: Array<{ schedule_date: string; start_time: string; end_time: string }>) => {
    try {
      const result = await createManySchedules(schedulesData);
      if (result.success) {
        setSuccessMessage(result.message);
        setShowTemplateEditor(false);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error creating many schedules:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert type="error" message="Vui lòng đăng nhập để xem lịch làm việc" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <SchedulePageHeader 
        onAddScheduleClick={handleAddClick}
        onTemplateClick={() => setShowTemplateEditor(true)}
      />
      
      {error && (
        <Alert type="error" message={error} />
      )}

      {successMessage && (
        <Alert type="success" message={successMessage} />
      )}
      
      <ScheduleStats schedules={schedules} />

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

      {showTemplateEditor && (
        <WeeklyTemplateEditor 
          onCreateManySchedules={handleCreateManySchedules}
          onClose={() => setShowTemplateEditor(false)}
        />
      )}
    </div>
  );
}