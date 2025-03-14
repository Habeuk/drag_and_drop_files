<?php

namespace Drupal\drag_and_drop_files\Element;

use Drupal\Core\Form\FormStateInterface;
use Drupal\file\Element\ManagedFile;
use Drupal\Core\Render\Element\FormElementBase;
use Drupal\Component\Serialization\Json;

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
      '#drag_and_drop_files_type' => '*',
      '#drag_and_drop_files_size' => 40 // 40Mo
    ];
  }
  
  /**
   *
   * @param array $element
   * @param FormStateInterface $form_state
   * @param array $complete_form
   * @return string
   */
  public static function process(array &$element, FormStateInterface $form_state, array &$complete_form) {
    // Ajoutez les bibliothèques CSS/JS.
    $element['#attached']['library'][] = 'drag_and_drop_files/dnd';
    // Passer les variables ne servent à rien car, les données doivent etre
    // traiter au bloc par bloc., on va passer par le html.
    // $element['#attached']['drupalSettings']['drag_and_drop_files']['type'] =
    // $element['#drag_and_drop_files_type'];
    
    $types = [
      'image/*',
      'video/*'
    ];
    $accept = '*';
    if (!empty($element['#drag_and_drop_files_type']) && in_array($element['#drag_and_drop_files_type'], $types)) {
      $accept = $element['#drag_and_drop_files_type'];
    }
    if (str_contains($element['#drag_and_drop_files_type'], "image/")) {
      $element['#theme'] = 'drag_and_drop_files_image';
    }
    if (str_contains($element['#drag_and_drop_files_type'], "video/")) {
      $element['#theme'] = 'drag_and_drop_files_video';
    }
    if (empty($element['#drag_and_drop_files_size'])) {
      //
    }
    /**
     * On enregistre le fichier via ajax.
     *
     * @var string $name
     */
    $name = !empty($element['#name']) ? $element['#name'] : 'dnd_upload';
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
        ],
        'type' => $element['#drag_and_drop_files_type']
      ]
    ];
    if (!empty($element['#default_value'])) {
      $element[$name . '-fid']['#default_value'] = $element['#default_value'];
      // $element['#attached']['drupalSettings']['drag_and_drop_files']['default_value']
      // = Json::decode($element['#default_value']);
    }
    if (!empty($element['#value'])) {
      $element[$name . '-fid']['#value'] = $element['#value'];
      // $element['#attached']['drupalSettings']['drag_and_drop_files']['value']
      // = Json::decode($element['#value']);
    }
    $element['#attributes']['type'] = $element['#drag_and_drop_files_type'];
    return $element;
  }
  
  /**
   * Prerender callback pour l'élément de formulaire.
   */
  public static function preRender(array $element) {
    // Ajoute des attributs supplémentaires au wrapper
    $element['#attributes']['class'][] = 'drag_and_drop_files';
    return $element;
  }
}