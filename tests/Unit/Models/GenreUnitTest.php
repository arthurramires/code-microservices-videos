<?php

namespace Tests\Unit\Models;

use App\Models\Genre;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GenreUnitTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */

    private $genre;

    protected function setUp(): void{
        parent::setUp();
        $this->genre = new Genre();
    }


    public function testFillable()
    {
        $fillable =  ['name', 'is_active'];
        $this->assertEquals(
            $fillable,
            $this->genre->getFillable()
        );
    }

    public function testIfUseTraits(){
        $traits = [
            SoftDeletes::class,
            Uuid::class
        ];

        $genreTraits = array_keys(class_uses(Genre::class));

        $this->assertEquals($traits, $genreTraits);

    }

    public function testCasts()
    {
        $cast = ['id' => 'string'];
        $this->assertEquals(
            $cast,
            $this->genre->getCasts()
        );
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        foreach($dates as $date){
            $this->assertContains($date, $this->genre->getDates());
        }
        $this->assertCount(count($dates), $this->genre->getDates());
    }
}
