<?php

namespace Tests\Unit\Models;

use App\Models\CastMember;
use App\Models\Category;
use App\Models\Genre;
use App\Models\Traits\Uuid;
use App\Rules\GenresHasCategories;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;

class GenreHasCategoriesRuleTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    private $categories;
    private $genres;

    public function setUp():void{
        parent::setUp();
        $this->categories = factory(Category::class, 4)->create();
        $this->genres = factory(Genre::class, 2)->create();

        $this->genres[0]->categories()->sync([
            $this->categories[0]->id,
            $this->categories[1]->id,
        ]);
        $this->genres[1]->categories()->sync([
            $this->categories[2]->id,
        ]);
    }
    
    public function testPassesValid(){
        $rule = new GenresHasCategories([
            $this->categories[2]->id
        ]);
        $isValid = $rule->passes('', [
            $this->genres[1]->id
        ]);
        $this->assertTrue($isValid);
    }

    public function testPassesIsNotValid(){
        $rule = new GenresHasCategories([
            $this->categories[0]->id
        ]);
        $isValid = $rule->passes('', [
            $this->genres[0]->id,
            $this->genres[1]->id,
        ]);
        $this->assertFalse($isValid);
    }
}
