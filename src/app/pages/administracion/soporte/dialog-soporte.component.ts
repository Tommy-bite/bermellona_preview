// import { Component } from '@angular/core';
// import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-dialog-soporte',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <h2 class="mb-4">Actualizar Estado del Soporte</h2>
//     <div>
//       <p><strong>Nombre:</strong> {{ data.nombre }}</p>
//       <p><strong>Motivo:</strong> {{ data.motivo }}</p>
//       <p><strong>Mensaje:</strong> {{ data.mensaje }}</p>
//       <div class="form-group">
//         <label for="estado">Estado</label>
//         <input
//           type="text"
//           class="form-control"
//           id="estado"
//           [(ngModel)]="data.estado"
//           disabled
//         />
//       </div>
//       <div class="form-group mt-3">
//         <label for="resolucion">Resolución</label>
//         <textarea
//           class="form-control"
//           id="resolucion"
//           rows="3"
//           [(ngModel)]="data.mensajeResolucion"
//           placeholder="Escribe la resolución del soporte"
//         ></textarea>
//       </div>
//     </div>
//     <div class="text-end mt-4">
//       <button class="btn btn-secondary me-2" (click)="dialogRef.close()">Cancelar</button>
//       <button class="btn btn-primary" (click)="guardar()">Guardar</button>
//     </div>
//   `,
// })
// export class DialogSoporteComponent {
//   constructor(
//     public dialogRef: DialogRef<DialogSoporteComponent>,
//     public data: { nombre: string; motivo: string; mensaje: string; estado: string; mensajeResolucion: string }
//   ) {}

//   guardar() {
//     if (!this.data.mensajeResolucion) {
//       alert('La resolución es obligatoria.');
//       return;
//     }
//     this.dialogRef.close(this.data);
//   }
// }
