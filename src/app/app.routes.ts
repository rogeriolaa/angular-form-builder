import { Routes } from '@angular/router';
import { FormEditorComponent } from './form-editor/form-editor.component';
import { FormFillComponent } from './form-fill/form-fill.component';
import { FormResponsesComponent } from './form-responses/form-responses.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'form/new',
    component: FormEditorComponent,
  },
  {
    path: 'form/edit/:id',
    component: FormEditorComponent,
  },
  {
    path: 'form/fill/:id',
    component: FormFillComponent,
  },
  {
    path: 'form/responses/:id',
    component: FormResponsesComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
