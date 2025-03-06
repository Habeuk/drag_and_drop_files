<?php

namespace Drupal\drag_and_drop_files\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Définit un formateur personnalisé pour les images Drag & Drop.
 *
 * @FieldFormatter(
 *   id = "drag_and_drop_files_formatter",
 *   label = @Translation("Custom Drag & Drop Formatter"),
 *   field_types = {"image"}
 * )
 */
class DragAndDropFilesFormatter extends FormatterBase implements ContainerFactoryPluginInterface {
  
  /**
   *
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static($plugin_id, $plugin_definition, $configuration['field_definition'], $configuration['settings'], $configuration['label'], $configuration['view_mode'], $configuration['third_party_settings']);
  }
  
  /**
   *
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];
    
    foreach ($items as $delta => $item) {
      // Récupère l'entité File associée
      $file = $item->entity;
      if (!$file) {
        continue;
      }
      
      // Génère l'URL de l'image
      $image_uri = $file->getFileUri();
      $url = \Drupal::service('file_url_generator')->generateAbsoluteString($image_uri);
      
      // Construit le rendu avec un template Twig
      $elements[$delta] = [
        '#theme' => 'custom_dnd_image_display',
        '#url' => $url,
        '#alt' => $item->alt ?? '',
        '#title' => $item->title ?? ''
      ];
    }
    
    return $elements;
  }
}