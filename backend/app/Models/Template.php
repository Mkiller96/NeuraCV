<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Template extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'thumbnail_url',
        'preview_url',
        'is_premium',
        'is_active',
        'colors',
        'fonts',
    ];

    protected function casts(): array
    {
        return [
            'is_premium' => 'boolean',
            'is_active' => 'boolean',
            'colors' => 'array',
            'fonts' => 'array',
        ];
    }

    public function cvTemplates(): HasMany
    {
        return $this->hasMany(CVTemplate::class);
    }
}
