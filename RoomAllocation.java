import java.util.*;

/**
 * Hostel Management System - Core Java Logic Module
 * This module demonstrates the business logic for Room Allocation 
 * based on student priority and availability.
 */
public class RoomAllocation {

    static class Student {
        String name;
        double percentage;
        String assignedRoom = "Not Assigned";

        Student(String name, double percentage) {
            this.name = name;
            this.percentage = percentage;
        }
    }

    static class Room {
        String roomNo;
        int capacity;
        int occupied = 0;

        Room(String roomNo, int capacity) {
            this.roomNo = roomNo;
            this.capacity = capacity;
        }

        boolean isAvailable() {
            return occupied < capacity;
        }
    }

    public static void main(String[] args) {
        System.out.println("--- Hostel Room Allocation Logic (AIP Demo) ---");

        // Sample Data: Students with their academic percentage
        List<Student> students = new ArrayList<>();
        students.add(new Student("Rahul Kumar", 85.5));
        students.add(new Student("Sneha Singh", 92.0));
        students.add(new Student("Amit Sharma", 78.5));
        students.add(new Student("Priya Verma", 88.0));

        // Sort students by percentage (Merit-based allocation)
        students.sort((s1, s2) -> Double.compare(s2.percentage, s1.percentage));

        // Sample Data: Rooms
        List<Room> rooms = new ArrayList<>();
        rooms.add(new Room("101", 2));
        rooms.add(new Room("102", 1));

        System.out.println("\nAllocating Rooms based on Merit...");

        // Allocation logic
        for (Student student : students) {
            for (Room room : rooms) {
                if (room.isAvailable()) {
                    student.assignedRoom = room.roomNo;
                    room.occupied++;
                    break;
                }
            }
        }

        // Output Results
        System.out.println("\nAllocation Results:");
        System.out.println("--------------------------------------------------");
        System.out.printf("%-15s | %-10s | %-12s%n", "Student Name", "Percent", "Room Assigned");
        System.out.println("--------------------------------------------------");
        for (Student s : students) {
            System.out.printf("%-15s | %-10.2f | %-12s%n", s.name, s.percentage, s.assignedRoom);
        }
        System.out.println("--------------------------------------------------");
        
        System.out.println("\nLogic Explanation:");
        System.out.println("1. Merit-based sorting is applied to the student list.");
        System.out.println("2. The system checks for available capacity in each room.");
        System.out.println("3. High-performing students (Sneha, Priya) are prioritized.");
        System.out.println("4. Amit remained unassigned as the total capacity (3) was less than students (4).");
    }
}
