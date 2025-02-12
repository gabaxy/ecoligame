<?php
// mod/ecoliplugin/mod_form.php

defined('MOODLE_INTERNAL') || die();

// Include the file that defines moodleform_mod.
require_once($CFG->dirroot.'/course/moodleform_mod.php');
// Optionally include your own local library if needed.
// require_once('locallib.php');

class mod_ecoliplugin_mod_form extends moodleform_mod {

    public function definition() {
        global $CFG, $DB, $COURSE;
        $mform =& $this->_form;

        // Retrieve instance id if editing.
        $id = $this->_instance;

        // (If needed, retrieve additional data from DB or URL parameters.)
        // For example, if you want to allow a game type to be passed:
        // $gamekind = optional_param('type', '', PARAM_ALPHA);

        // Add a hidden element if needed (e.g., to store plugin-specific info).
        // $mform->addElement('hidden', 'gamekind', $gamekind);
        // $mform->setType('gamekind', PARAM_ALPHA);

        // Header section.
        $mform->addElement('header', 'general', get_string('general', 'form'));

        // Activity name.
        $mform->addElement('text', 'name', get_string('ecolipluginname', 'ecoliplugin'), ['size' => '64']);
        $mform->setType('name', PARAM_TEXT);
        $mform->setDefault('name', get_string('ecoliplugindefaultname', 'ecoliplugin'));
        $mform->addRule('name', null, 'required', null, 'client');

        // Standard introduction (if your plugin supports an introduction).
        $this->standard_intro_elements();

        // Add any additional custom form elements if necessary.
        // For instance, plugin-specific settings can be added here.

        // Add the standard course module elements.
        $this->standard_coursemodule_elements();

        // Add the action buttons.
        $this->add_action_buttons();
    }
}
