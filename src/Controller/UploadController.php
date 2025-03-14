<?php

namespace Drupal\drag_and_drop_files\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\webform\Entity\Webform;
use Drupal\webform\WebformElementManagerInterface;

/**
 *
 * @author stephane
 *        
 */
class UploadController extends ControllerBase {
  
  /**
   * Build the Styled image.
   */
  public function getImageUrl($fid) {
    $file = \Drupal\file\Entity\File::load($fid);
    $datas = [];
    if ($file) {
      // $datas = $file->toArray();
      $datas['filename'] = $file->getFilename();
      $datas['url'] = \Drupal::service('file_url_generator')->generateAbsoluteString($file->getFileUri());
    }
    //
    return new JsonResponse($datas);
  }
  
  /**
   *
   * @param Request $request
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   */
  public function handleUpload(Request $request) {
    // On charge la configuration du champs.
    // Charger le Webform.
    // $webform_id = 'user_liste_de_produits';
    // $field_webform = 'images';
    // $webform = Webform::load($webform_id);
    // if ($webform) {
    // $elements = $webform->getElementsDecoded();
    // dump($elements['container_container']['container_images'][$field_webform]);
    // if
    // (isset($elements['container_container']['container_images'][$field_webform]))
    // {
    // // Récupérer le gestionnaire d'éléments Webform.
    // $element_manager = \Drupal::service('plugin.manager.webform.element');
    // // Obtenir la définition du type de champ.
    // $field_type =
    // $elements['container_container']['container_images'][$field_webform]['#type'];
    // $field_definition = $element_manager->getDefinition($field_type);
    // // Afficher la configuration et la définition du champ.
    // dd($field_definition);
    // }
    // }
    //
    $file = $request->files->get('file');
    $error = [];
    if ($file->getSize() > 40 * 1024 * 1024) { // 40 Mo
      $error[] = 'Le fichier est trop volumineux.';
    }
    if (empty($error)) {
      // Enregistrez le fichier dans le système Drupal
      $destination = 'public://dnd-uploads/';
      \Drupal::service('file_system')->prepareDirectory($destination, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
      
      $file_entity = \Drupal\file\Entity\File::create(
        [
          'uid' => \Drupal::currentUser()->id(),
          'filename' => $file->getClientOriginalName(),
          'uri' => $destination . $file->getClientOriginalName(),
          'status' => 1 // pendant la phase de test.
        ]);
      
      $file_entity->save();
      // Déplacez le fichier temporaire vers la destination finale
      move_uploaded_file($file->getRealPath(), $file_entity->getFileUri());
      return new JsonResponse([
        'fid' => $file_entity->id(),
        'url' => \Drupal::service('file_url_generator')->generateAbsoluteString($file_entity->getFileUri()),
        'filename' => $file_entity->getFilename()
      ]);
    }
    return new JsonResponse([
      'errors' => $error
    ], 400);
  }
}