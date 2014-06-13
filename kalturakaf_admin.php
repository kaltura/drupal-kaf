<?php
/**
 * @file kalturakaf_admin.php
 * This file includes implementation of module settings page
 */
module_load_include('php', 'kalturakaf', 'kalturaClient/KalturaClient');

function kalturakaf_setup_form() {
    $form = array();
    $form['kaf_url'] = array(
        '#type' => 'textfield',
        '#title' => t('KAF Instance Base-URL'),
        '#default_value' => variable_get('kalturakaf_url', ''),
        '#description' => t('Base URL for your KAF instance as provided to you by your Project Manager'),
    );
    $form['partner_id'] = array(
        '#type' => 'textfield',
        '#title' => t('Partner ID'),
        '#default_value' => variable_get('kalturakaf_partner_id', ''),
        '#description' => t('Your Kaltura Partner ID'),
    );
    $form['admin_secret'] = array(
        '#type' => 'textfield',
        '#title' => t('Admin Secret'),
        '#default_value' => variable_get('kalturakaf_admin_secret', ''),
        '#description' => t('Your Kaltura Admin Secret'),
    );
    $form['kaltura_server_url'] = array(
        '#type' => 'textfield',
        '#title' => t('Kaltura Server URL'),
        '#default_value' => variable_get('kalturakaf_kaltura_host', 'http://www.kaltura.com'),
        '#description' => t('The URL to the Kaltura Server your account is hosted on (http://www.kaltura.com for SaaS)'),
    );
    
    $form['submit'] = array(
        '#type' => 'submit',
        '#value' => t('submit'),
    );
    return $form;
}

function kalturakaf_setup_form_validate($form, &$form_state) {
    $values = $form_state['values'];
    if(isset($values['kaf_url']) && isset($values['partner_id']) && isset($values['admin_secret']) && isset($values['kaltura_server_url'])) {
        if(!empty($values['kaf_url']) && !empty($values['partner_id']) && !empty($values['admin_secret']) && !empty($values['kaltura_server_url'])) {
            if(!kalturakaf_verify_details($values['partner_id'], $values['admin_secret'], $values['kaltura_server_url'])) {
                form_set_error('', t('Could not get partner from Kaltura'));
            }
        }
        else {
            form_set_error('', t('All fields must have value'));
        }
    }
    else {
        form_set_error('', t('All fields must have value'));
    }
}

function kalturakaf_setup_form_submit($form, &$form_state) {
    $values = $form_state['values'];
    if(!kalturakaf_verify_details($values['partner_id'], $values['admin_secret'], $values['kaltura_server_url'])) {
        drupal_set_message('Failed saving the details', 'error');
    }
    else {
        variable_set('kalturakaf_partner_id',       $values['partner_id']);
        variable_set('kalturakaf_admin_secret',     $values['admin_secret']);
        variable_set('kalturakaf_url',              $values['kaf_url']);
        variable_set('kalturakaf_kaltura_host',     $values['kaltura_server_url']);
        drupal_set_message(t('Congratulations! You have successfully installed the Kaltura-KAF Video Module'));
        drupal_goto('admin/config/media/kalturakaf');
    }
}

function kalturakaf_verify_details($partnerId, $secret, $kalturaHost)
{
    $config = new KalturaConfiguration($partnerId);
    $config->serviceUrl = $kalturaHost;
    $client = new KalturaClient($config);
    $ks = $client->generateSessionV2($secret, 'drupal-admin', KalturaSessionType::ADMIN, $partnerId, 86400, '');
    $client->setKs($ks);

    try {
        $partner = $client->partner->get($partnerId);
        if($partner->id != $partnerId) {
            return false;
        }
    } catch (KalturaException $ex) {
        return false;
    }
    
    return true;
}