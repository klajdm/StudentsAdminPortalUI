import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {

  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddres: ''
    }
  }

  isNewStudent = false;
  header = '';
  displayProfileImageUrl = '';
  genderList: Gender[] = [];

  @ViewChild('studentsDetailsForm') studentsDetailsForm?: NgForm;

  constructor(
    private readonly studentService: StudentService,
    private readonly genderService: GenderService,
    private readonly route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private router: Router
  ) {

  }


  ngOnInit(): void {

    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');

        if (this.studentId) {

          // If the route contains the 'Add'
          if (this.studentId.toLowerCase() === 'Add'.toLowerCase()) {
            // -> new Student Functioanilty
            this.isNewStudent = true;
            this.header = 'Add New Student';
            this.setImage();

          } else {
            // -> Existing Student Functioanilty
            this.isNewStudent = false;
            this.header = 'Edit Student';

            this.studentService.getStudent(this.studentId)
              .subscribe(
                (successResponse) => {
                  this.student = successResponse;
                  this.setImage();
                },
                (errorResponse) => {
                  this.setImage();
                }
              );
          }

          this.genderService.getGenderList()
            .subscribe(
              (successResponse) => {
                this.genderList = successResponse;
              }
            )
        }
      }
    )

  }

  onUpdate(): void {
    if (this.studentsDetailsForm?.form.valid) {
      // Submit data to api 
      // Call Student Service to Update Student
      this.studentService.updateStudent(this.student.id, this.student)
        .subscribe(
          (successResponse) => {
            // Show a notification
            this.snackbar.open('Student updated successfully', undefined, {
              duration: 2000
            })
          },
          (errorResponse) => {
            // Log it
          }
        );
    }
  }

  onDelete(): void {
    this.studentService.deleteStudent(this.student.id)
      .subscribe(
        (successResponse) => {
          this.snackbar.open('Student deleted successfully', undefined, {
            duration: 2000
          });

          setTimeout(() => {
            this.router.navigateByUrl('students');
          }, 2000);

        },
        (errorResponse) => {
          //Log

        }
      )
  }

  onAdd(): void {
    if (this.studentsDetailsForm?.form.valid) {
      // Submit data to api 
      this.studentService.addStudent(this.student)
        .subscribe(
          (successResponse) => {
            this.snackbar.open('Student added successfully', undefined, {
              duration: 2000
            });

            setTimeout(() => {
              this.router.navigateByUrl(`students/${successResponse.id}`);
            }, 2000);

          },
          (errorResponse) => {

          }
        );
    }

  }

  uploadImage(event: any): void {
    if (this.studentId) {
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file)
        .subscribe(
          (succesResponse) => {
            this.student.profileImageUrl = succesResponse;
            this.setImage();

            // Show a notification
            this.snackbar.open('Profile image updated', undefined, {
              duration: 2000
            })
          },
          (errorResponse) => {

          }
        );

    }

  }

  private setImage(): void {
    if (this.student.profileImageUrl) {
      // Fetch the image by url
      this.displayProfileImageUrl = this.studentService.getImagePath(this.student.profileImageUrl);

    } else {
      // Display a default
      this.displayProfileImageUrl = '/assets/user.png';
      ;
    }
  }

}
