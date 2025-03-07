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
 *   id = "custom_dnd_image",
 *   label = @Translation("Drag & Drop Image"),
 *   category = @Translation("Custom Elements"),
 *   multiline = TRUE,
 *   composite = FALSE,
 * )
 */
class WebformCustomDndImage extends WebformElementBase {
  
  /**
   *
   * {@inheritdoc}
   */
  protected function defineDefaultProperties() {
    return [
      'max_filesize' => '2MB',
      'file_extensions' => 'png jpg jpeg',
      'upload_location' => 'public://webform-dnd'
    ] + parent::defineDefaultProperties();
  }
  
  /**
   * Configuration du formulaire.
   *
   * {@inheritdoc}
   */
  public function form(array $form, FormStateInterface $form_state) {
    $form = parent::form($form, $form_state);
    
    // Configuration spécifique
    $form['file'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('File settings')
    ];
    
    $form['file']['max_filesize'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Maximum file size'),
      '#default_value' => $this->getDefaultProperty('max_filesize')
    ];
    
    $form['file']['file_extensions'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Allowed file extensions'),
      '#default_value' => $this->getDefaultProperty('file_extensions')
    ];
    
    $form['file']['upload_location'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Upload location'),
      '#default_value' => $this->getDefaultProperty('upload_location')
    ];
    
    return $form;
  }
  
  /**
   * Affichage de l'element.
   *
   * {@inheritdoc}
   */
  public function prepare(array &$element, WebformSubmissionInterface $webform_submission = NULL) {
    parent::prepare($element, $webform_submission);
    // Ajoute les librairies
    // $element['#attached']['library'][] = 'custom_dnd/dnd';
    // $element['#attached']['library'][] = 'custom_dnd/webform-dnd';
    
    // // Structure de l'élément
    // $element['#theme'] = 'webform_custom_dnd_image';
    $element['#type'] = 'drag_and_drop_files';
    // $element['#process'][] = [
    // '\Drupal\drag_and_drop_files\Element\DragAndDropFiles',
    // 'process'
    // ];
    $element['#drag_and_drop_files_type'] = 'image/*';
  }
  
  /**
   *
   * {@inheritdoc}
   */
  public function preSave(array &$element, WebformSubmissionInterface $webform_submission) {
    // Récupère la valeur soumise
    $value = $webform_submission->getElementData($element['#webform_key']);
    // Exemple : Formater la valeur (ajouter un préfixe ou un suffixe)
    if (!empty($value)) {
      $webform_submission->setElementData($element['#webform_key'], Json::encode($value));
    }
  }
}