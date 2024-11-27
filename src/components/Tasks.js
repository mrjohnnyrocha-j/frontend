// src/components/Tasks.js

import React, { useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  useTheme,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editInput, setEditInput] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const theme = useTheme();

  /**
   * Adds a new task.
   */
  const handleAddTask = () => {
    if (taskInput.trim() === '') {
      setSnackbarMessage('Please enter a task.');
      setSnackbarOpen(true);
      return;
    }
    const newTask = {
      id: Date.now(),
      text: taskInput,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setTaskInput('');
  };

  /**
   * Toggles task completion status.
   * @param {number} id - The ID of the task.
   */
  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  /**
   * Opens the edit dialog for a task.
   * @param {Object} task - The task to edit.
   */
  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditInput(task.text);
  };

  /**
   * Saves the edited task.
   */
  const handleSaveEdit = () => {
    if (editInput.trim() === '') {
      setSnackbarMessage('Please enter a task.');
      setSnackbarOpen(true);
      return;
    }
    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id ? { ...task, text: editInput } : task
      )
    );
    setEditingTask(null);
    setEditInput('');
  };

  /**
   * Deletes a task.
   * @param {number} id - The ID of the task.
   */
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  /**
   * Closes the snackbar notification.
   */
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <TextField
          label="New Task"
          variant="outlined"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTask}
          sx={{ ml: 2 }}
        >
          Add Task
        </Button>
      </Box>

      <List sx={{ mt: 3 }}>
        {tasks.length === 0 ? (
          <Typography variant="body1">No tasks added yet.</Typography>
        ) : (
          tasks.map((task) => (
            <ListItem key={task.id} divider>
              <Checkbox
                edge="start"
                checked={task.completed}
                tabIndex={-1}
                disableRipple
                onChange={() => handleToggleComplete(task.id)}
              />
              <ListItemText
                primary={task.text}
                style={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditTask(task)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteTask(task.id)}
                  sx={{ ml: 1 }}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        )}
      </List>

      {/* Edit Task Dialog */}
      <Dialog
        open={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
      >
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task"
            variant="outlined"
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingTask(null)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Tasks;
