<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('c_v_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('c_v_id')->constrained('c_v_s')->cascadeOnDelete();
            $table->foreignId('template_id')->constrained()->cascadeOnDelete();
            $table->json('custom_colors')->nullable();
            $table->json('custom_fonts')->nullable();
            $table->string('layout_style')->default('classic');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('c_v_templates');
    }
};
