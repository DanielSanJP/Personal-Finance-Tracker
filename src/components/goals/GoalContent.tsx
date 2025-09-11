"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmptyGoals } from "@/components/empty-states";
import GoalActions from "./GoalActions";
import GoalList from "./GoalList";
import { useGoals, useDeleteGoal } from "@/hooks/queries";

interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
  category: string | null;
  priority: string | null;
  status: string;
}

export default function GoalContent() {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);

  // React Query hooks
  const { data: goals = [], refetch } = useGoals();
  const deleteGoalMutation = useDeleteGoal();

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!goalToDelete) return;

    try {
      await deleteGoalMutation.mutateAsync(goalToDelete.id);
      setDeleteConfirmOpen(false);
      setGoalToDelete(null);
    } catch {
      // Error handling is done in the mutation
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            Savings Goals
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {goals.length === 0 ? (
            <EmptyGoals onRefresh={refetch} />
          ) : (
            <>
              <GoalActions
                goals={goals}
                onGoalToDelete={setGoalToDelete}
                onOpenDeleteConfirm={setDeleteConfirmOpen}
              />
              <GoalList goals={goals} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{goalToDelete?.name}
              &rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setGoalToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteGoalMutation.isPending}
            >
              {deleteGoalMutation.isPending ? "Deleting..." : "Delete Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
