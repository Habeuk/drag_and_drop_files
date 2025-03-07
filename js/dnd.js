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
    //window.addEventListener("load", () => {
    this.dropzones.forEach(dropzone => {
      const fileInput = dropzone.parentNode.querySelector(".dnd-file-input");
      const previews = dropzone.parentNode.querySelector(".dnd-previews");
      this.manageDragZone(dropzone, fileInput);
      this.uploadFiles(fileInput, previews);
    });
    //});
  }
  previewBoxImage() {
    const generatedElement = {
      container_image: document.createElement("div"),
      content_bg: document.createElement("div"),
      content_text: document.createElement("div"),
      imge_title: document.createElement("span"),
      progressbar: document.createElement("span"),
      icone_complete: document.createElement("svg"),
      icone_remove: document.createElement("svg")
    };
    generatedElement.container_image.classList.add("container_image");
    generatedElement.content_bg.classList.add("content_bg");
    generatedElement.content_text.classList.add("content_text");
    generatedElement.imge_title.classList.add("imge_title");
    generatedElement.progressbar.classList.add("progressbar");
    generatedElement.icone_complete.classList.add("icone_complete");
    generatedElement.icone_remove.classList.add("icone_remove");
    //
    generatedElement.imge_title.innerHTML = "Chargement encours ...";
    //
    generatedElement.content_text.appendChild(generatedElement.imge_title);
    generatedElement.content_text.appendChild(generatedElement.progressbar);
    generatedElement.content_text.appendChild(generatedElement.icone_complete);
    generatedElement.content_text.appendChild(generatedElement.icone_remove);
    generatedElement.container_image.appendChild(generatedElement.content_bg);
    generatedElement.container_image.appendChild(generatedElement.content_text);
    const svgCode = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 117.72 117.72" style="enable-background:new 0 0 117.72 117.72" xml:space="preserve">
  <style type="text/css">
    <![CDATA[
      .st0{fill:#01A601;}
    ]]>
  </style>
  <g>
    <path class="st0" d="M58.86,0c9.13,0,17.77,2.08,25.49,5.79c-3.16,2.5-6.09,4.9-8.82,7.21c-5.2-1.89-10.81-2.92-16.66-2.92 c-13.47,0-25.67,5.46-34.49,14.29c-8.83,8.83-14.29,21.02-14.29,34.49c0,13.47,5.46,25.66,14.29,34.49 c8.83,8.83,21.02,14.29,34.49,14.29s25.67-5.46,34.49-14.29c8.83-8.83,14.29-21.02,14.29-34.49c0-3.2-0.31-6.34-0.9-9.37 c2.53-3.3,5.12-6.59,7.77-9.85c2.08,6.02,3.21,12.49,3.21,19.22c0,16.25-6.59,30.97-17.24,41.62 c-10.65,10.65-25.37,17.24-41.62,17.24c-16.25,0-30.97-6.59-41.62-17.24C6.59,89.83,0,75.11,0,58.86 c0-16.25,6.59-30.97,17.24-41.62S42.61,0,58.86,0L58.86,0z M31.44,49.19L45.8,49l1.07,0.28c2.9,1.67,5.63,3.58,8.18,5.74 c1.84,1.56,3.6,3.26,5.27,5.1c5.15-8.29,10.64-15.9,16.44-22.9c6.35-7.67,13.09-14.63,20.17-20.98l1.4-0.54H114l-3.16,3.51 C101.13,30,92.32,41.15,84.36,52.65C76.4,64.16,69.28,76.04,62.95,88.27l-1.97,3.8l-1.81-3.87c-3.34-7.17-7.34-13.75-12.11-19.63 c-4.77-5.88-10.32-11.1-16.79-15.54L31.44,49.19L31.44,49.19z"/>
  </g>
</svg>
`;
    return generatedElement;
  }
  uploadFiles(fileInput, previews) {
    fileInput.addEventListener("change", e => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      // on affiche le preview
      const generatedElement = this.previewBoxImage();
      previews.appendChild(generatedElement.container_image);
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
        generatedElement.content_bg.style.backgroundImage = `url(${data.url})`;
        generatedElement.imge_title.innerHTML = data.filename;
        generatedElement.progressbar.classList.add("complete");
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
      console.log("fileInput : ", dropzone);
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
      const dropzones = once("drag_and_drop_files_run", ".dnd-dropzone", context);
      if (dropzones && dropzones.length) {
        const dnd = new _drag_and_drop__WEBPACK_IMPORTED_MODULE_1__["default"](dropzones, settings);
        dnd.build();
      }
    }
  };
})(Drupal);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFBRUMsUUFBUSxDQUFDO1FBQ2hEcUUsR0FBRyxDQUFDcEUsS0FBSyxDQUFDLENBQUM7TUFDYjtJQUNGO0VBQ0YsQ0FBQztBQUNILENBQUMsRUFBRThELE1BQU0sQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHN0ZXBoYW5lODg4L3didS1hdG9taXF1ZS10aGVtZS8uL3NyYy9qcy9kcmFnLWFuZC1kcm9wLmpzIiwid2VicGFjazovL0BzdGVwaGFuZTg4OC93YnUtYXRvbWlxdWUtdGhlbWUvLi9zcmMvc2Nzcy9kbmQuc2NzcyIsIndlYnBhY2s6Ly9Ac3RlcGhhbmU4ODgvd2J1LWF0b21pcXVlLXRoZW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BzdGVwaGFuZTg4OC93YnUtYXRvbWlxdWUtdGhlbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0BzdGVwaGFuZTg4OC93YnUtYXRvbWlxdWUtdGhlbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9Ac3RlcGhhbmU4ODgvd2J1LWF0b21pcXVlLXRoZW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQHN0ZXBoYW5lODg4L3didS1hdG9taXF1ZS10aGVtZS8uL3NyYy9qcy9kbmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgRHJhZ0FuZERyb3Age1xuICBjb25zdHJ1Y3Rvcihkcm9wem9uZXMsIHNldHRpbmdzID0gW10pIHtcbiAgICB0aGlzLmRyb3B6b25lcyA9IGRyb3B6b25lcztcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGlzYXRpb25cbiAgICovXG4gIGJ1aWxkKCkge1xuICAgIC8vd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgICB0aGlzLmRyb3B6b25lcy5mb3JFYWNoKChkcm9wem9uZSkgPT4ge1xuICAgICAgY29uc3QgZmlsZUlucHV0ID0gZHJvcHpvbmUucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKFwiLmRuZC1maWxlLWlucHV0XCIpO1xuICAgICAgY29uc3QgcHJldmlld3MgPSBkcm9wem9uZS5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoXCIuZG5kLXByZXZpZXdzXCIpO1xuICAgICAgdGhpcy5tYW5hZ2VEcmFnWm9uZShkcm9wem9uZSwgZmlsZUlucHV0KTtcbiAgICAgIHRoaXMudXBsb2FkRmlsZXMoZmlsZUlucHV0LCBwcmV2aWV3cyk7XG4gICAgfSk7XG4gICAgLy99KTtcbiAgfVxuXG4gIHByZXZpZXdCb3hJbWFnZSgpIHtcbiAgICBjb25zdCBnZW5lcmF0ZWRFbGVtZW50ID0ge1xuICAgICAgY29udGFpbmVyX2ltYWdlOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLFxuICAgICAgY29udGVudF9iZzogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcbiAgICAgIGNvbnRlbnRfdGV4dDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcbiAgICAgIGltZ2VfdGl0bGU6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpLFxuICAgICAgcHJvZ3Jlc3NiYXI6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpLFxuICAgICAgaWNvbmVfY29tcGxldGU6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdmdcIiksXG4gICAgICBpY29uZV9yZW1vdmU6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdmdcIiksXG4gICAgfTtcbiAgICBnZW5lcmF0ZWRFbGVtZW50LmNvbnRhaW5lcl9pbWFnZS5jbGFzc0xpc3QuYWRkKFwiY29udGFpbmVyX2ltYWdlXCIpO1xuICAgIGdlbmVyYXRlZEVsZW1lbnQuY29udGVudF9iZy5jbGFzc0xpc3QuYWRkKFwiY29udGVudF9iZ1wiKTtcbiAgICBnZW5lcmF0ZWRFbGVtZW50LmNvbnRlbnRfdGV4dC5jbGFzc0xpc3QuYWRkKFwiY29udGVudF90ZXh0XCIpO1xuICAgIGdlbmVyYXRlZEVsZW1lbnQuaW1nZV90aXRsZS5jbGFzc0xpc3QuYWRkKFwiaW1nZV90aXRsZVwiKTtcbiAgICBnZW5lcmF0ZWRFbGVtZW50LnByb2dyZXNzYmFyLmNsYXNzTGlzdC5hZGQoXCJwcm9ncmVzc2JhclwiKTtcbiAgICBnZW5lcmF0ZWRFbGVtZW50Lmljb25lX2NvbXBsZXRlLmNsYXNzTGlzdC5hZGQoXCJpY29uZV9jb21wbGV0ZVwiKTtcbiAgICBnZW5lcmF0ZWRFbGVtZW50Lmljb25lX3JlbW92ZS5jbGFzc0xpc3QuYWRkKFwiaWNvbmVfcmVtb3ZlXCIpO1xuICAgIC8vXG4gICAgZ2VuZXJhdGVkRWxlbWVudC5pbWdlX3RpdGxlLmlubmVySFRNTCA9IFwiQ2hhcmdlbWVudCBlbmNvdXJzIC4uLlwiO1xuICAgIC8vXG4gICAgZ2VuZXJhdGVkRWxlbWVudC5jb250ZW50X3RleHQuYXBwZW5kQ2hpbGQoZ2VuZXJhdGVkRWxlbWVudC5pbWdlX3RpdGxlKTtcbiAgICBnZW5lcmF0ZWRFbGVtZW50LmNvbnRlbnRfdGV4dC5hcHBlbmRDaGlsZChnZW5lcmF0ZWRFbGVtZW50LnByb2dyZXNzYmFyKTtcbiAgICBnZW5lcmF0ZWRFbGVtZW50LmNvbnRlbnRfdGV4dC5hcHBlbmRDaGlsZChnZW5lcmF0ZWRFbGVtZW50Lmljb25lX2NvbXBsZXRlKTtcbiAgICBnZW5lcmF0ZWRFbGVtZW50LmNvbnRlbnRfdGV4dC5hcHBlbmRDaGlsZChnZW5lcmF0ZWRFbGVtZW50Lmljb25lX3JlbW92ZSk7XG4gICAgZ2VuZXJhdGVkRWxlbWVudC5jb250YWluZXJfaW1hZ2UuYXBwZW5kQ2hpbGQoZ2VuZXJhdGVkRWxlbWVudC5jb250ZW50X2JnKTtcbiAgICBnZW5lcmF0ZWRFbGVtZW50LmNvbnRhaW5lcl9pbWFnZS5hcHBlbmRDaGlsZChnZW5lcmF0ZWRFbGVtZW50LmNvbnRlbnRfdGV4dCk7XG4gICAgY29uc3Qgc3ZnQ29kZSA9IGBcbjxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiTGF5ZXJfMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiIHZpZXdCb3g9XCIwIDAgMTE3LjcyIDExNy43MlwiIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMTcuNzIgMTE3LjcyXCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cbiAgPHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPlxuICAgIDwhW0NEQVRBW1xuICAgICAgLnN0MHtmaWxsOiMwMUE2MDE7fVxuICAgIF1dPlxuICA8L3N0eWxlPlxuICA8Zz5cbiAgICA8cGF0aCBjbGFzcz1cInN0MFwiIGQ9XCJNNTguODYsMGM5LjEzLDAsMTcuNzcsMi4wOCwyNS40OSw1Ljc5Yy0zLjE2LDIuNS02LjA5LDQuOS04LjgyLDcuMjFjLTUuMi0xLjg5LTEwLjgxLTIuOTItMTYuNjYtMi45MiBjLTEzLjQ3LDAtMjUuNjcsNS40Ni0zNC40OSwxNC4yOWMtOC44Myw4LjgzLTE0LjI5LDIxLjAyLTE0LjI5LDM0LjQ5YzAsMTMuNDcsNS40NiwyNS42NiwxNC4yOSwzNC40OSBjOC44Myw4LjgzLDIxLjAyLDE0LjI5LDM0LjQ5LDE0LjI5czI1LjY3LTUuNDYsMzQuNDktMTQuMjljOC44My04LjgzLDE0LjI5LTIxLjAyLDE0LjI5LTM0LjQ5YzAtMy4yLTAuMzEtNi4zNC0wLjktOS4zNyBjMi41My0zLjMsNS4xMi02LjU5LDcuNzctOS44NWMyLjA4LDYuMDIsMy4yMSwxMi40OSwzLjIxLDE5LjIyYzAsMTYuMjUtNi41OSwzMC45Ny0xNy4yNCw0MS42MiBjLTEwLjY1LDEwLjY1LTI1LjM3LDE3LjI0LTQxLjYyLDE3LjI0Yy0xNi4yNSwwLTMwLjk3LTYuNTktNDEuNjItMTcuMjRDNi41OSw4OS44MywwLDc1LjExLDAsNTguODYgYzAtMTYuMjUsNi41OS0zMC45NywxNy4yNC00MS42MlM0Mi42MSwwLDU4Ljg2LDBMNTguODYsMHogTTMxLjQ0LDQ5LjE5TDQ1LjgsNDlsMS4wNywwLjI4YzIuOSwxLjY3LDUuNjMsMy41OCw4LjE4LDUuNzQgYzEuODQsMS41NiwzLjYsMy4yNiw1LjI3LDUuMWM1LjE1LTguMjksMTAuNjQtMTUuOSwxNi40NC0yMi45YzYuMzUtNy42NywxMy4wOS0xNC42MywyMC4xNy0yMC45OGwxLjQtMC41NEgxMTRsLTMuMTYsMy41MSBDMTAxLjEzLDMwLDkyLjMyLDQxLjE1LDg0LjM2LDUyLjY1Qzc2LjQsNjQuMTYsNjkuMjgsNzYuMDQsNjIuOTUsODguMjdsLTEuOTcsMy44bC0xLjgxLTMuODdjLTMuMzQtNy4xNy03LjM0LTEzLjc1LTEyLjExLTE5LjYzIGMtNC43Ny01Ljg4LTEwLjMyLTExLjEtMTYuNzktMTUuNTRMMzEuNDQsNDkuMTlMMzEuNDQsNDkuMTl6XCIvPlxuICA8L2c+XG48L3N2Zz5cbmA7XG4gICAgcmV0dXJuIGdlbmVyYXRlZEVsZW1lbnQ7XG4gIH1cblxuICB1cGxvYWRGaWxlcyhmaWxlSW5wdXQsIHByZXZpZXdzKSB7XG4gICAgZmlsZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBlLnRhcmdldC5maWxlc1swXTtcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICBmb3JtRGF0YS5hcHBlbmQoXCJmaWxlXCIsIGZpbGUpO1xuICAgICAgLy8gb24gYWZmaWNoZSBsZSBwcmV2aWV3XG4gICAgICBjb25zdCBnZW5lcmF0ZWRFbGVtZW50ID0gdGhpcy5wcmV2aWV3Qm94SW1hZ2UoKTtcbiAgICAgIHByZXZpZXdzLmFwcGVuZENoaWxkKGdlbmVyYXRlZEVsZW1lbnQuY29udGFpbmVyX2ltYWdlKTtcbiAgICAgIC8vIFVwbG9hZCBhdmVjIEZldGNoIEFQSVxuICAgICAgZmV0Y2goXCIvZHJhZ19hbmRfZHJvcF9maWxlcy91cGxvYWRcIiwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB0aHJvdyBuZXcgRXJyb3IoXCJFcnJldXIgcsOpc2VhdVwiKTtcbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIC8vIE1ldCDDoCBqb3VyIGxlIGNoYW1wIGNhY2jDqVxuICAgICAgICAgIGNvbnN0IGZpZElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0LmRyYWdfYW5kX2Ryb3BfZmlsZXMtLWZpZHNcIik7XG4gICAgICAgICAgaWYgKGZpZElucHV0KSBmaWRJbnB1dC52YWx1ZSA9IGRhdGEuZmlkO1xuXG4gICAgICAgICAgLy8gQWZmaWNoZSBsJ2FwZXLDp3VcbiAgICAgICAgICBnZW5lcmF0ZWRFbGVtZW50LmNvbnRlbnRfYmcuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke2RhdGEudXJsfSlgO1xuICAgICAgICAgIGdlbmVyYXRlZEVsZW1lbnQuaW1nZV90aXRsZS5pbm5lckhUTUwgPSBkYXRhLmZpbGVuYW1lO1xuICAgICAgICAgIGdlbmVyYXRlZEVsZW1lbnQucHJvZ3Jlc3NiYXIuY2xhc3NMaXN0LmFkZChcImNvbXBsZXRlXCIpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycmV1cjpcIiwgZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIG1hbmFnZURyYWdab25lKGRyb3B6b25lLCBmaWxlSW5wdXQpIHtcbiAgICBkcm9wem9uZS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGRyb3B6b25lLmNsYXNzTGlzdC5hZGQoXCJkcmFnb3ZlclwiKTtcbiAgICB9KTtcblxuICAgIGRyb3B6b25lLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGRyb3B6b25lLmNsYXNzTGlzdC5yZW1vdmUoXCJkcmFnb3ZlclwiKTtcbiAgICB9KTtcblxuICAgIGRyb3B6b25lLmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBkcm9wem9uZS5jbGFzc0xpc3QucmVtb3ZlKFwiZHJhZ292ZXJcIik7XG4gICAgICBjb25zdCBmaWxlcyA9IGUuZGF0YVRyYW5zZmVyLmZpbGVzO1xuICAgICAgaWYgKGZpbGVzLmxlbmd0aCkge1xuICAgICAgICBmaWxlSW5wdXQuZmlsZXMgPSBmaWxlcztcbiAgICAgICAgZmlsZUlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiY2hhbmdlXCIpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIENsaWMgcG91ciBvdXZyaXIgbGUgc8OpbGVjdGV1ciBkZSBmaWNoaWVyc1xuICAgIGRyb3B6b25lLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBmaWxlSW5wdXQuY2xpY2soKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiZmlsZUlucHV0IDogXCIsIGRyb3B6b25lKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEcmFnQW5kRHJvcDtcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi4vc2Nzcy9kbmQuc2Nzc1wiO1xuXG5pbXBvcnQgRHJhZ0FuZERyb3AgZnJvbSBcIi4vZHJhZy1hbmQtZHJvcFwiO1xuKGZ1bmN0aW9uIChEcnVwYWwpIHtcbiAgRHJ1cGFsLmJlaGF2aW9ycy5kcmFnX2FuZF9kcm9wX2ZpbGVzID0ge1xuICAgIGF0dGFjaDogZnVuY3Rpb24gKGNvbnRleHQsIHNldHRpbmdzKSB7XG4gICAgICBjb25zdCBkcm9wem9uZXMgPSBvbmNlKFwiZHJhZ19hbmRfZHJvcF9maWxlc19ydW5cIiwgXCIuZG5kLWRyb3B6b25lXCIsIGNvbnRleHQpO1xuICAgICAgaWYgKGRyb3B6b25lcyAmJiBkcm9wem9uZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGRuZCA9IG5ldyBEcmFnQW5kRHJvcChkcm9wem9uZXMsIHNldHRpbmdzKTtcbiAgICAgICAgZG5kLmJ1aWxkKCk7XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn0pKERydXBhbCk7XG4iXSwibmFtZXMiOlsiRHJhZ0FuZERyb3AiLCJjb25zdHJ1Y3RvciIsImRyb3B6b25lcyIsInNldHRpbmdzIiwiYnVpbGQiLCJmb3JFYWNoIiwiZHJvcHpvbmUiLCJmaWxlSW5wdXQiLCJwYXJlbnROb2RlIiwicXVlcnlTZWxlY3RvciIsInByZXZpZXdzIiwibWFuYWdlRHJhZ1pvbmUiLCJ1cGxvYWRGaWxlcyIsInByZXZpZXdCb3hJbWFnZSIsImdlbmVyYXRlZEVsZW1lbnQiLCJjb250YWluZXJfaW1hZ2UiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjb250ZW50X2JnIiwiY29udGVudF90ZXh0IiwiaW1nZV90aXRsZSIsInByb2dyZXNzYmFyIiwiaWNvbmVfY29tcGxldGUiLCJpY29uZV9yZW1vdmUiLCJjbGFzc0xpc3QiLCJhZGQiLCJpbm5lckhUTUwiLCJhcHBlbmRDaGlsZCIsInN2Z0NvZGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImZpbGUiLCJ0YXJnZXQiLCJmaWxlcyIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJmZXRjaCIsIm1ldGhvZCIsImJvZHkiLCJoZWFkZXJzIiwiQWNjZXB0IiwidGhlbiIsInJlc3BvbnNlIiwib2siLCJFcnJvciIsImpzb24iLCJkYXRhIiwiZmlkSW5wdXQiLCJ2YWx1ZSIsImZpZCIsInN0eWxlIiwiYmFja2dyb3VuZEltYWdlIiwidXJsIiwiZmlsZW5hbWUiLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsInByZXZlbnREZWZhdWx0IiwicmVtb3ZlIiwiZGF0YVRyYW5zZmVyIiwibGVuZ3RoIiwiZGlzcGF0Y2hFdmVudCIsIkV2ZW50IiwiY2xpY2siLCJsb2ciLCJEcnVwYWwiLCJiZWhhdmlvcnMiLCJkcmFnX2FuZF9kcm9wX2ZpbGVzIiwiYXR0YWNoIiwiY29udGV4dCIsIm9uY2UiLCJkbmQiXSwic291cmNlUm9vdCI6IiJ9