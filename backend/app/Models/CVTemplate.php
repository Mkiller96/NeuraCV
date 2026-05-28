<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CVTemplate extends Model
{
    protected $fillable = [
        'c_v_id',
        'template_id',
        'custom_colors',
        'custom_fonts',
        'layout_style',
    ];

    protected function casts(): array
    {
        return [
            'custom_colors' => 'array',
            'custom_fonts' => 'array',
        ];
    }

    public function cv(): BelongsTo
    {
        return $this->belongsTo(CV::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }
}
