/*
 * Decompiled with CFR 0_97.
 */
package com.tcs.testtool;

import com.tcs.testtool.Task;
import com.tcs.testtool.Utilities;
import java.io.PrintStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class TaskManagerService {
    private Connection connection = Utilities.getConnection();

    private static Timestamp getCurrentTimeStamp() {
        Date today = new Date();
        return new Timestamp(today.getTime());
    }

    public void addTask(Task task) {
        try {
            PreparedStatement preparedStatement = this.connection.prepareStatement("insert into task_list(task_id , task_name,task_description,task_priority,task_status,task_archived,task_start_time,task_end_time) values (seq_task_list.nextval,?, ?, ?,?,?,?,?)");
            System.out.println("Task:" + task.getTaskName());
            preparedStatement.setString(1, task.getTaskName());
            preparedStatement.setString(2, task.getTaskDescription());
            preparedStatement.setString(3, task.getTaskPriority());
            preparedStatement.setString(4, task.getTaskStatus());
            preparedStatement.setInt(5, 0);
            Date dt = new Date();
            preparedStatement.setTimestamp(6, TaskManagerService.getCurrentTimeStamp());
            preparedStatement.setTimestamp(7, TaskManagerService.getCurrentTimeStamp());
            preparedStatement.executeUpdate();
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void archiveTask(int taskId) {
        try {
            PreparedStatement preparedStatement = this.connection.prepareStatement("update task_list set task_archived=1 where task_id=?");
            preparedStatement.setInt(1, taskId);
            preparedStatement.executeUpdate();
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void updateTask(Task task) throws ParseException {
        try {
            PreparedStatement preparedStatement = this.connection.prepareStatement("update task_list set task_name=?, task_description=?, task_priority=?,task_status=?where task_id=?");
            preparedStatement.setString(1, task.getTaskName());
            preparedStatement.setString(2, task.getTaskDescription());
            preparedStatement.setString(3, task.getTaskPriority());
            preparedStatement.setString(4, task.getTaskStatus());
            preparedStatement.setInt(4, task.getTaskId());
            preparedStatement.executeUpdate();
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void changeTaskStatus(int taskId, String status) throws ParseException {
        try {
            PreparedStatement preparedStatement = this.connection.prepareStatement("update task_list set task_status=? where task_id=?");
            preparedStatement.setString(1, status);
            preparedStatement.setInt(2, taskId);
            preparedStatement.executeUpdate();
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public List<Task> getAllTasks() {
        ArrayList<Task> tasks = new ArrayList<Task>();
        try {
            Statement statement = this.connection.createStatement();
            ResultSet rs = statement.executeQuery("select * from task_list where task_archived=0");
            while (rs.next()) {
                Task task = new Task();
                task.setTaskId(rs.getInt("task_id"));
                task.setTaskName(rs.getString("task_name"));
                task.setTaskDescription(rs.getString("task_description"));
                task.setTaskPriority(rs.getString("task_priority"));
                task.setTaskStatus(rs.getString("task_status"));
                tasks.add(task);
            }
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        return tasks;
    }

    public Task getTaskById(int taskId) {
        Task task = new Task();
        try {
            PreparedStatement preparedStatement = this.connection.prepareStatement("select * from task_list where task_id=?");
            preparedStatement.setInt(1, taskId);
            ResultSet rs = preparedStatement.executeQuery();
            if (rs.next()) {
                task.setTaskId(rs.getInt("task_id"));
                task.setTaskName(rs.getString("task_name"));
                task.setTaskDescription(rs.getString("task_description"));
                task.setTaskPriority(rs.getString("task_priority"));
                task.setTaskStatus(rs.getString("task_status"));
            }
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        return task;
    }
}
