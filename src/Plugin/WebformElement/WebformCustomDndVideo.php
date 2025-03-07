<?php

namespace Drupal\drag_and_drop_files\Plugin\WebformElement;

use Drupal\webform\Plugin\WebformElementBase;
use Drupal\Component\Serialization\Json;
use Drupal\Core\Form\FormStateInterface;
use Drupal\webform\WebformSubmissionInterface;

/**
 * Définit un élément Webform pour l'upload d'image par Drag & Drop.
 *
 * @WebformElement(
 *   id = "drag_and_drop_files_video",
 *   label = @Translation("Drag & Drop video"),
 *   category = @Translation("Custom Elements"),
 *   multiline = TRUE,
 *   composite = FALSE,
 * )
 */
class WebformCustomDndVideo extends WebformCustomDnd {
  
  /**
   * Affichage de l'element.
   *
   * {@inheritdoc}
   */
  public function prepare(array &$element, WebformSubmissionInterface $webform_submission = NULL) {
    parent::prepare($element, $webform_submission);
    $element['#drag_and_drop_files_type'] = 'video/*';
  }
}