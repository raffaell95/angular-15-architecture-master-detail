import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/reports',
    pathMatch: 'full'
  },
  {
    path: 'entries', 
    loadChildren: () => import('./pages/entries/entries.module').then(m => m.EntriesModule)
  },
  {
    path: 'categories', 
    loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesModule)
  },
  {
    path: 'reports', 
    loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
