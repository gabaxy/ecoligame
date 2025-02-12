<?php
// mod/ecoliplugin/db/access.php

defined('MOODLE_INTERNAL') || die();

$capabilities = [

    // Ability to view the ecoliplugin activity.
    'mod/ecoliplugin:view' => [
        'captype'      => 'read',
        'contextlevel' => CONTEXT_MODULE,
        'archetypes'   => [
            'guest'           => CAP_ALLOW,
            'student'         => CAP_ALLOW,
            'teacher'         => CAP_ALLOW,
            'editingteacher'  => CAP_ALLOW,
            'manager'         => CAP_ALLOW,
        ]
    ],

    // Ability to attempt (play) the game.
    'mod/ecoliplugin:attempt' => [
        'riskbitmask'  => RISK_SPAM,
        'captype'      => 'write',
        'contextlevel' => CONTEXT_MODULE,
        'archetypes'   => [
            'student' => CAP_ALLOW,
            'guest'   => CAP_ALLOW,
        ]
    ],

    // Ability for a student to review their own attempts.
    'mod/ecoliplugin:reviewmyattempts' => [
        'captype'      => 'read',
        'contextlevel' => CONTEXT_MODULE,
        'archetypes'   => [
            'student' => CAP_ALLOW,
        ],
        'clonepermissionsfrom' => 'mod/ecoliplugin:attempt'
    ],

    // Ability to manage the plugin (edit settings, questions, etc.)
    'mod/ecoliplugin:manage' => [
        'riskbitmask'  => RISK_SPAM,
        'captype'      => 'write',
        'contextlevel' => CONTEXT_MODULE,
        'archetypes'   => [
            'editingteacher' => CAP_ALLOW,
            'manager'        => CAP_ALLOW,
        ]
    ],

    // Ability to manage overrides.
    'mod/ecoliplugin:manageoverrides' => [
        'captype'      => 'write',
        'contextlevel' => CONTEXT_MODULE,
        'archetypes'   => [
            'editingteacher' => CAP_ALLOW,
            'manager'        => CAP_ALLOW,
        ]
    ],

    // Ability to view reports.
    'mod/ecoliplugin:viewreports' => [
        'riskbitmask'  => RISK_PERSONAL,
        'captype'      => 'read',
        'contextlevel' => CONTEXT_MODULE,
        'archetypes'   => [
            'teacher'        => CAP_ALLOW,
            'editingteacher' => CAP_ALLOW,
            'manager'        => CAP_ALLOW,
        ]
    ],

    // Ability to delete attempts (if needed).
    'mod/ecoliplugin:deleteattempts' => [
        'riskbitmask'  => RISK_DATALOSS,
        'captype'      => 'write',
        'contextlevel' => CONTEXT_MODULE,
        'archetypes'   => [
            'editingteacher' => CAP_ALLOW,
            'manager'        => CAP_ALLOW,
        ]
    ],

    // Ability to add a new instance of the plugin.
    'mod/ecoliplugin:addinstance' => [
        'riskbitmask'  => RISK_XSS,
        'captype'      => 'write',
        'contextlevel' => CONTEXT_COURSE,
        'archetypes'   => [
            'editingteacher' => CAP_ALLOW,
            'manager'        => CAP_ALLOW,
        ],
        'clonepermissionsfrom' => 'moodle/course:manageactivities'
    ],
];
