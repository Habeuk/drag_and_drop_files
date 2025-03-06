class DragAndDrop {
  constructor(dropzones, settings = []) {
    this.dropzones = dropzones;
    this.settings = settings;
  }

  /**
   * Initialisation
   */
  build() {
    window.addEventListener("load", () => {
      this.dropzones.forEach((dropzone) => {
        // Marque la zone comme traitée
        dropzone.setAttribute("data-dnd-processed", "true");
        // variables
        const fileInput = dropzone.parentNode.querySelector(".dnd-file-input");
        const previews = dropzone.parentNode.querySelector(".dnd-previews");
        this.manageDragZone(dropzone, fileInput);
        this.uploadFiles(fileInput, previews);
      });
    });
  }

  uploadFiles(fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      // Upload avec Fetch API
      fetch("/drag_and_drop_files/upload", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Erreur réseau");
          return response.json();
        })
        .then((data) => {
          // Met à jour le champ caché
          const fidInput = document.querySelector("input.drag_and_drop_files--fids");
          if (fidInput) fidInput.value = data.fid;

          // Affiche l'aperçu
          const img = document.createElement("img");
          img.src = data.url;
          img.style.maxWidth = "200px";
          previews.appendChild(img);
        })
        .catch((error) => {
          console.error("Erreur:", error);
        });
    });
  }

  manageDragZone(dropzone, fileInput) {
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      const files = e.dataTransfer.files;
      if (files.length) {
        fileInput.files = files;
        fileInput.dispatchEvent(new Event("change"));
      }
    });

    // Clic pour ouvrir le sélecteur de fichiers
    dropzone.addEventListener("click", () => {
      fileInput.click();
    });
  }
}

export default DragAndDrop;
