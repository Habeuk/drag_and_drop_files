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
    $class = static::class;
    return [
      '#input' => TRUE,
      '#process' => [
        $class . '::process'
      ],
      '#theme' => 'drag_and_drop_files',
      '#theme_wrappers' => [
        'form_element'
      ],
      '#pre_render' => [
        $class . '::preRender'
      ],
      '#drag_and_drop_files_type' => '*'
    ];
  }
  
  public static function process(array &$element, FormStateInterface $form_state, array &$complete_form) {
    // Ajoutez les bibliothèques CSS/JS.
    $element['#attached']['library'][] = 'drag_and_drop_files/dnd';
    $types = [
      'image/*',
      'video/*'
    ];
    $accept = '*';
    if (!empty($element['#drag_and_drop_files_type']) && in_array($element['#drag_and_drop_files_type'], $types)) {
      $accept = $element['#drag_and_drop_files_type'];
    }
    /**
     * On enregistre le fichier via ajax.
     *
     * @var string $name
     */
    $name = !empty($element['#name']) ? $element['#name'] . 'dnd' : 'dnd_upload';
    $element[$name] = [
      '#type' => 'file',
      '#name' => $name,
      '#attributes' => [
        'class' => [
          'dnd-file-input'
        ],
        'accept' => $accept
      ]
    ];
    $element[$name . '-fid'] = [
      '#type' => 'hidden',
      '#name' => $name . '[fid]',
      '#value' => null,
      '#attributes' => [
        'class' => [
          'drag_and_drop_files--fids'
        ]
      ]
    ];
    
    return $element;
  }
  
  /**
   * Prerender callback pour l'élément de formulaire.
   */
  public static function preRender(array $element) {
    // Ajoute des attributs supplémentaires au wrapper
    return $element;
  }
}