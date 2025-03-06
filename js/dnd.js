/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/drag-and-drop.js":
/*!*********************************!*\
  !*** ./src/js/drag-and-drop.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
      this.dropzones.forEach(dropzone => {
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
    fileInput.addEventListener("change", e => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      // Upload avec Fetch API
      fetch("/drag_and_drop_files/upload", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      }).then(response => {
        if (!response.ok) throw new Error("Erreur réseau");
        return response.json();
      }).then(data => {
        // Met à jour le champ caché
        const fidInput = document.querySelector("input.drag_and_drop_files--fids");
        if (fidInput) fidInput.value = data.fid;

        // Affiche l'aperçu
        const img = document.createElement("img");
        img.src = data.url;
        img.style.maxWidth = "200px";
        previews.appendChild(img);
      }).catch(error => {
        console.error("Erreur:", error);
      });
    });
  }
  manageDragZone(dropzone, fileInput) {
    dropzone.addEventListener("dragover", e => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });
    dropzone.addEventListener("dragleave", e => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
    });
    dropzone.addEventListener("drop", e => {
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DragAndDrop);

/***/ }),

/***/ "./src/scss/dnd.scss":
/*!***************************!*\
  !*** ./src/scss/dnd.scss ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/js/dnd.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_dnd_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/dnd.scss */ "./src/scss/dnd.scss");
/* harmony import */ var _drag_and_drop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./drag-and-drop */ "./src/js/drag-and-drop.js");


(function (Drupal) {
  Drupal.behaviors.drag_and_drop_files = {
    attach: function (context, settings) {
      const dropzones = context.querySelectorAll(".dnd-dropzone:not([data-dnd-processed])");
      if (dropzones && dropzones.length) {
        console.log("dropzones : ", dropzones);
        const dnd = new _drag_and_drop__WEBPACK_IMPORTED_MODULE_1__["default"](dropzones, settings);
        dnd.build();
      }
    }
  };
})(Drupal);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ04wQjtBQUVnQjtBQUMxQyxDQUFDLFVBQVV5RCxNQUFNLEVBQUU7RUFDakJBLE1BQU0sQ0FBQ0MsU0FBUyxDQUFDQyxtQkFBbUIsR0FBRztJQUNyQ0MsTUFBTSxFQUFFLFNBQUFBLENBQVVDLE9BQU8sRUFBRTFELFFBQVEsRUFBRTtNQUNuQyxNQUFNRCxTQUFTLEdBQUcyRCxPQUFPLENBQUNDLGdCQUFnQixDQUFDLHlDQUF5QyxDQUFDO01BQ3JGLElBQUk1RCxTQUFTLElBQUlBLFNBQVMsQ0FBQ21ELE1BQU0sRUFBRTtRQUNqQ04sT0FBTyxDQUFDZ0IsR0FBRyxDQUFDLGNBQWMsRUFBRTdELFNBQVMsQ0FBQztRQUN0QyxNQUFNOEQsR0FBRyxHQUFHLElBQUloRSxzREFBVyxDQUFDRSxTQUFTLEVBQUVDLFFBQVEsQ0FBQztRQUNoRDZELEdBQUcsQ0FBQzVELEtBQUssQ0FBQyxDQUFDO01BQ2I7SUFDRjtFQUNGLENBQUM7QUFDSCxDQUFDLEVBQUVxRCxNQUFNLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL0BzdGVwaGFuZTg4OC93YnUtYXRvbWlxdWUtdGhlbWUvLi9zcmMvanMvZHJhZy1hbmQtZHJvcC5qcyIsIndlYnBhY2s6Ly9Ac3RlcGhhbmU4ODgvd2J1LWF0b21pcXVlLXRoZW1lLy4vc3JjL3Njc3MvZG5kLnNjc3MiLCJ3ZWJwYWNrOi8vQHN0ZXBoYW5lODg4L3didS1hdG9taXF1ZS10aGVtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9Ac3RlcGhhbmU4ODgvd2J1LWF0b21pcXVlLXRoZW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9Ac3RlcGhhbmU4ODgvd2J1LWF0b21pcXVlLXRoZW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQHN0ZXBoYW5lODg4L3didS1hdG9taXF1ZS10aGVtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0BzdGVwaGFuZTg4OC93YnUtYXRvbWlxdWUtdGhlbWUvLi9zcmMvanMvZG5kLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIERyYWdBbmREcm9wIHtcbiAgY29uc3RydWN0b3IoZHJvcHpvbmVzLCBzZXR0aW5ncyA9IFtdKSB7XG4gICAgdGhpcy5kcm9wem9uZXMgPSBkcm9wem9uZXM7XG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpc2F0aW9uXG4gICAqL1xuICBidWlsZCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5kcm9wem9uZXMuZm9yRWFjaCgoZHJvcHpvbmUpID0+IHtcbiAgICAgICAgLy8gTWFycXVlIGxhIHpvbmUgY29tbWUgdHJhaXTDqWVcbiAgICAgICAgZHJvcHpvbmUuc2V0QXR0cmlidXRlKFwiZGF0YS1kbmQtcHJvY2Vzc2VkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgLy8gdmFyaWFibGVzXG4gICAgICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRyb3B6b25lLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihcIi5kbmQtZmlsZS1pbnB1dFwiKTtcbiAgICAgICAgY29uc3QgcHJldmlld3MgPSBkcm9wem9uZS5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoXCIuZG5kLXByZXZpZXdzXCIpO1xuICAgICAgICB0aGlzLm1hbmFnZURyYWdab25lKGRyb3B6b25lLCBmaWxlSW5wdXQpO1xuICAgICAgICB0aGlzLnVwbG9hZEZpbGVzKGZpbGVJbnB1dCwgcHJldmlld3MpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICB1cGxvYWRGaWxlcyhmaWxlSW5wdXQpIHtcbiAgICBmaWxlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IGUudGFyZ2V0LmZpbGVzWzBdO1xuICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgIGZvcm1EYXRhLmFwcGVuZChcImZpbGVcIiwgZmlsZSk7XG5cbiAgICAgIC8vIFVwbG9hZCBhdmVjIEZldGNoIEFQSVxuICAgICAgZmV0Y2goXCIvZHJhZ19hbmRfZHJvcF9maWxlcy91cGxvYWRcIiwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB0aHJvdyBuZXcgRXJyb3IoXCJFcnJldXIgcsOpc2VhdVwiKTtcbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIC8vIE1ldCDDoCBqb3VyIGxlIGNoYW1wIGNhY2jDqVxuICAgICAgICAgIGNvbnN0IGZpZElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0LmRyYWdfYW5kX2Ryb3BfZmlsZXMtLWZpZHNcIik7XG4gICAgICAgICAgaWYgKGZpZElucHV0KSBmaWRJbnB1dC52YWx1ZSA9IGRhdGEuZmlkO1xuXG4gICAgICAgICAgLy8gQWZmaWNoZSBsJ2FwZXLDp3VcbiAgICAgICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICAgIGltZy5zcmMgPSBkYXRhLnVybDtcbiAgICAgICAgICBpbWcuc3R5bGUubWF4V2lkdGggPSBcIjIwMHB4XCI7XG4gICAgICAgICAgcHJldmlld3MuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJldXI6XCIsIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBtYW5hZ2VEcmFnWm9uZShkcm9wem9uZSwgZmlsZUlucHV0KSB7XG4gICAgZHJvcHpvbmUuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBkcm9wem9uZS5jbGFzc0xpc3QuYWRkKFwiZHJhZ292ZXJcIik7XG4gICAgfSk7XG5cbiAgICBkcm9wem9uZS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBkcm9wem9uZS5jbGFzc0xpc3QucmVtb3ZlKFwiZHJhZ292ZXJcIik7XG4gICAgfSk7XG5cbiAgICBkcm9wem9uZS5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZHJvcHpvbmUuY2xhc3NMaXN0LnJlbW92ZShcImRyYWdvdmVyXCIpO1xuICAgICAgY29uc3QgZmlsZXMgPSBlLmRhdGFUcmFuc2Zlci5maWxlcztcbiAgICAgIGlmIChmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgZmlsZUlucHV0LmZpbGVzID0gZmlsZXM7XG4gICAgICAgIGZpbGVJbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImNoYW5nZVwiKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBDbGljIHBvdXIgb3V2cmlyIGxlIHPDqWxlY3RldXIgZGUgZmljaGllcnNcbiAgICBkcm9wem9uZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgZmlsZUlucHV0LmNsaWNrKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRHJhZ0FuZERyb3A7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4uL3Njc3MvZG5kLnNjc3NcIjtcblxuaW1wb3J0IERyYWdBbmREcm9wIGZyb20gXCIuL2RyYWctYW5kLWRyb3BcIjtcbihmdW5jdGlvbiAoRHJ1cGFsKSB7XG4gIERydXBhbC5iZWhhdmlvcnMuZHJhZ19hbmRfZHJvcF9maWxlcyA9IHtcbiAgICBhdHRhY2g6IGZ1bmN0aW9uIChjb250ZXh0LCBzZXR0aW5ncykge1xuICAgICAgY29uc3QgZHJvcHpvbmVzID0gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKFwiLmRuZC1kcm9wem9uZTpub3QoW2RhdGEtZG5kLXByb2Nlc3NlZF0pXCIpO1xuICAgICAgaWYgKGRyb3B6b25lcyAmJiBkcm9wem9uZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZHJvcHpvbmVzIDogXCIsIGRyb3B6b25lcyk7XG4gICAgICAgIGNvbnN0IGRuZCA9IG5ldyBEcmFnQW5kRHJvcChkcm9wem9uZXMsIHNldHRpbmdzKTtcbiAgICAgICAgZG5kLmJ1aWxkKCk7XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn0pKERydXBhbCk7XG4iXSwibmFtZXMiOlsiRHJhZ0FuZERyb3AiLCJjb25zdHJ1Y3RvciIsImRyb3B6b25lcyIsInNldHRpbmdzIiwiYnVpbGQiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiZm9yRWFjaCIsImRyb3B6b25lIiwic2V0QXR0cmlidXRlIiwiZmlsZUlucHV0IiwicGFyZW50Tm9kZSIsInF1ZXJ5U2VsZWN0b3IiLCJwcmV2aWV3cyIsIm1hbmFnZURyYWdab25lIiwidXBsb2FkRmlsZXMiLCJlIiwiZmlsZSIsInRhcmdldCIsImZpbGVzIiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsImFwcGVuZCIsImZldGNoIiwibWV0aG9kIiwiYm9keSIsImhlYWRlcnMiLCJBY2NlcHQiLCJ0aGVuIiwicmVzcG9uc2UiLCJvayIsIkVycm9yIiwianNvbiIsImRhdGEiLCJmaWRJbnB1dCIsImRvY3VtZW50IiwidmFsdWUiLCJmaWQiLCJpbWciLCJjcmVhdGVFbGVtZW50Iiwic3JjIiwidXJsIiwic3R5bGUiLCJtYXhXaWR0aCIsImFwcGVuZENoaWxkIiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJwcmV2ZW50RGVmYXVsdCIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsImRhdGFUcmFuc2ZlciIsImxlbmd0aCIsImRpc3BhdGNoRXZlbnQiLCJFdmVudCIsImNsaWNrIiwiRHJ1cGFsIiwiYmVoYXZpb3JzIiwiZHJhZ19hbmRfZHJvcF9maWxlcyIsImF0dGFjaCIsImNvbnRleHQiLCJxdWVyeVNlbGVjdG9yQWxsIiwibG9nIiwiZG5kIl0sInNvdXJjZVJvb3QiOiIifQ==