import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {

  studentName = "";
  course = "";
  students: any[] = [];
  editMode = false;
  editIndex = -1;
  editId = -1;

  private apiUrl = "https://student-management-system-t7uq.onrender.com/students";

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.loadStudents();
  }

  loadStudents() {
    this.http.get<any[]>(this.apiUrl, {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      params: { t: new Date().getTime().toString() }
    }).subscribe({
      next: (data) => {
        this.students = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Failed to load students:", err)
    });
  }

  addStudent() {
    if (!this.studentName.trim() || !this.course.trim()) return;
    const student = { name: this.studentName, course: this.course };
    this.http.post(this.apiUrl, student).subscribe({
      next: () => { this.loadStudents(); this.clearForm(); },
      error: (err) => console.error("Failed to add student:", err)
    });
  }

  deleteStudent(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.loadStudents(),
      error: (err) => console.error("Failed to delete student:", err)
    });
  }

  editStudent(student: any) {
    this.studentName = student.name;
    this.course = student.course;
    this.editMode = true;
    this.editId = student.id;
  }

  updateStudent() {
    if (!this.studentName.trim() || !this.course.trim()) return;
    const updated = { name: this.studentName, course: this.course };
    this.http.put(`${this.apiUrl}/${this.editId}`, updated).subscribe({
      next: () => { this.loadStudents(); this.clearForm(); },
      error: (err) => console.error("Failed to update student:", err)
    });
  }

  cancelEdit() {
    this.clearForm();
  }

  private clearForm() {
    this.studentName = "";
    this.course = "";
    this.editMode = false;
    this.editIndex = -1;
    this.editId = -1;
  }

}