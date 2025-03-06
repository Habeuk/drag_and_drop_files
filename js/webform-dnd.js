((Drupal, once) => {
  Drupal.behaviors.webformDnd = {
    attach(context) {
      once('webform-dnd', '.webform-dnd-container', context).forEach(container => {
        const dropzone = container.querySelector('.dnd-dropzone');
        const fileInput = container.querySelector('.dnd-file-input');
        const preview = container.querySelector('.dnd-preview');

        // Drag & Drop
        dropzone.addEventListener('dragover', e => {
          e.preventDefault();
          dropzone.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', () => {
          dropzone.classList.remove('dragover');
        });

        dropzone.addEventListener('drop', e => {
          e.preventDefault();
          dropzone.classList.remove('dragover');
          handleFiles(e.dataTransfer.files);
        });

        // Click to upload
        dropzone.addEventListener('click', () => fileInput.click());

        // File selection
        fileInput.addEventListener('change', e => handleFiles(e.target.files));

        function handleFiles(files) {
          if (files.length > 0) {
            const file = files[0];
            preview.innerHTML = '';
            
            // Aperçu de l'image
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = document.createElement('img');
              img.src = e.target.result;
              img.style.maxWidth = '200px';
              preview.appendChild(img);
            };
            reader.readAsDataURL(file);

            // Soumission via Webform
            const formData = new FormData();
            formData.append('file', file);

            fetch('/custom-dnd/webform-upload', {
              method: 'POST',
              body: formData
            })
            .then(response => response.json())
            .then(data => {
              const hiddenInput = document.createElement('input');
              hiddenInput.type = 'hidden';
              hiddenInput.name = fileInput.dataset.drupalSelector;
              hiddenInput.value = data.fid;
              container.appendChild(hiddenInput);
            });
          }
        }
      });
    }
  };
})(Drupal, once);