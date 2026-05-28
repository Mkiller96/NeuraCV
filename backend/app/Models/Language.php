<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Language extends Model
{
    protected $fillable = [
        'c_v_id',
        'name',
        'proficiency',
        'sort_order',
    ];

    public function cv(): BelongsTo
    {
        return $this->belongsTo(CV::class);
    }
}
