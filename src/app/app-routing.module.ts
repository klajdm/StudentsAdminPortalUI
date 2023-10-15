import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './component/students/students.component';
import { ViewStudentComponent } from './component/students/view-student/view-student.component';

const routes: Routes = [
  {
    path: '', component: StudentsComponent
  },
  {
    path: 'students', component: StudentsComponent
  },
  {
    path: 'students/:id', component: ViewStudentComponent
  },
  {
    path: 'students/add', component: ViewStudentComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
