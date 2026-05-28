<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CV extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'full_name',
        'email',
        'phone',
        'address',
        'website',
        'linkedin',
        'github',
        'professional_summary',
        'photo_url',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(Experience::class)->orderBy('sort_order');
    }

    public function education(): HasMany
    {
        return $this->hasMany(Education::class)->orderBy('sort_order');
    }

    public function skills(): HasMany
    {
        return $this->hasMany(Skill::class)->orderBy('sort_order');
    }

    public function languages(): HasMany
    {
        return $this->hasMany(Language::class)->orderBy('sort_order');
    }

    public function cvTemplate(): HasOne
    {
        return $this->hasOne(CVTemplate::class);
    }
}
