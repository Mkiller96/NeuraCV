<?php

namespace Database\Seeders;

use App\Models\Template;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Classic',
                'slug' => 'classic',
                'description' => 'A traditional, clean CV layout suitable for all industries.',
                'is_premium' => false,
                'colors' => ['primary' => '#1a365d', 'secondary' => '#2d3748', 'accent' => '#3182ce'],
                'fonts' => ['heading' => 'serif', 'body' => 'sans-serif'],
            ],
            [
                'name' => 'Modern',
                'slug' => 'modern',
                'description' => 'A sleek, contemporary design with a sidebar layout.',
                'is_premium' => false,
                'colors' => ['primary' => '#2c5282', 'secondary' => '#4a5568', 'accent' => '#38b2ac'],
                'fonts' => ['heading' => 'sans-serif', 'body' => 'sans-serif'],
            ],
            [
                'name' => 'Minimal',
                'slug' => 'minimal',
                'description' => 'A minimalist design focusing on content with plenty of white space.',
                'is_premium' => false,
                'colors' => ['primary' => '#1a202c', 'secondary' => '#718096', 'accent' => '#e53e3e'],
                'fonts' => ['heading' => 'sans-serif', 'body' => 'sans-serif'],
            ],
            [
                'name' => 'Creative',
                'slug' => 'creative',
                'description' => 'A bold, creative layout perfect for design and marketing roles.',
                'is_premium' => true,
                'colors' => ['primary' => '#6b46c1', 'secondary' => '#2d3748', 'accent' => '#f6ad55'],
                'fonts' => ['heading' => 'display', 'body' => 'sans-serif'],
            ],
            [
                'name' => 'Executive',
                'slug' => 'executive',
                'description' => 'A professional, premium template for senior-level positions.',
                'is_premium' => true,
                'colors' => ['primary' => '#1a365d', 'secondary' => '#2d3748', 'accent' => '#c5a572'],
                'fonts' => ['heading' => 'serif', 'body' => 'serif'],
            ],
        ];

        foreach ($templates as $template) {
            Template::create($template);
        }
    }
}
