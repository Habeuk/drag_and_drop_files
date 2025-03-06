<?php

namespace Drupal\drag_and_drop_files\Element;

use Drupal\Core\Form\FormStateInterface;
use Drupal\file\Element\ManagedFile;
use Drupal\Core\Render\Element\FormElementBase;

/**
 * Définit un élément de formulaire personnalisé pour le Drag & Drop.
 *
 * @FormElement("drag_and_drop_files")
 */
class DragAndDropFiles extends FormElementBase {
  
  public function getInfo() {
    return [
      '#input' => TRUE,
      '#process' => [
        self::class . '::process'
      ],
      '#theme' => 'drag_and_drop_files',
      '#theme_wrappers' => [
        'form_element'
      ]
    ];
  }
  
  public static function process(array &$element, FormStateInterface $form_state, array &$complete_form) {
    // Ajoutez les bibliothèques CSS/JS.
    $element['#attached']['library'][] = 'drag_and_drop_files/dnd';
    
    // Ajoutez une zone de dépôt et un input de fichier caché.
    $element['dropzone'] = [
      '#markup' => '<div class="dnd-dropzone"><div class="dnd-label">Glissez une image ici ou cliquez pour sélectionner</div></div>'
    ];
    $name = !empty($element['#name']) ? $element['#name'] : 'dnd_upload';
    $element['upload'] = [
      '#type' => 'file',
      '#name' => $name,
      '#attributes' => [
        'class' => [
          'dnd-file-input'
        ],
        'accept' => 'image/*'
      ]
    ];
    $element['fid'] = [
      '#type' => 'hidden',
      '#name' => $name . '[fid]',
      '#value' => null
    ];
    
    return $element;
  }
}