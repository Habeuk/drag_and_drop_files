(function (Drupal) {
  'use strict';
  
  Drupal.behaviors.drag_and_drop_files = {
    attach: function (context) {
      // Sélectionne toutes les zones de dépôt non traitées
      const dropzones = context.querySelectorAll('.dnd-dropzone:not([data-dnd-processed])');

      dropzones.forEach((dropzone) => {
        // Marque la zone comme traitée
        dropzone.setAttribute('data-dnd-processed', 'true');
        const fileInput = dropzone.parentNode.querySelector('.dnd-file-input');

        // Gestion du Drag & Drop
        dropzone.addEventListener('dragover', (e) => {
          e.preventDefault();
          dropzone.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', (e) => {
          e.preventDefault();
          dropzone.classList.remove('dragover');
        });

        dropzone.addEventListener('drop', (e) => {
          e.preventDefault();
          dropzone.classList.remove('dragover');
          const files = e.dataTransfer.files;
          if (files.length) {
            fileInput.files = files;
            fileInput.dispatchEvent(new Event('change'));
          }
        });

        // Clic pour ouvrir le sélecteur de fichiers
        dropzone.addEventListener('click', () => {
          fileInput.click();
        });

        // Gestion de l'upload
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          const formData = new FormData();
          formData.append('file', file);

          // Upload avec Fetch API
          fetch('/drag_and_drop_files/upload', {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json',
            },
          })
          .then(response => {
            if (!response.ok) throw new Error('Erreur réseau');
            return response.json();
          })
          .then(data => {
            // Met à jour le champ caché
            const fidInput = document.querySelector('input[name="drag[fid]"]');
            if (fidInput) fidInput.value = data.fid;

            // Affiche l'aperçu
            const img = document.createElement('img');
            img.src = data.url;
            img.style.maxWidth = '200px';
            dropzone.appendChild(img);
          })
          .catch(error => {
            console.error('Erreur:', error);
          });
        });
      });
    }
  };
})(Drupal);