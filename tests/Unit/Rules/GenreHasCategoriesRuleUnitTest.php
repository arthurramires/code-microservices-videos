<?php

namespace Tests\Unit\Models;

use App\Models\CastMember;
use App\Models\Traits\Uuid;
use App\Rules\GenresHasCategories;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;

class GenreHasCategoriesRuleUnitTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */

    public function testCategoriesIdField()
    {
        $rule = new GenresHasCategories(
            [1, 1, 2, 2]
        );
        $reflectionClass = new \ReflectionClass(GenresHasCategories::class);
        $reflectionProperty = $reflectionClass->getProperty('categoriesId');
        $reflectionProperty->setAccessible(true);

        $categoriesId = $reflectionProperty->getValue($rule);
        $this->assertEqualsCanonicalizing([1, 2], $categoriesId);
    }

    public function testGenresIdvalue(){
       $rule = new GenresHasCategories([]);
       $rule->passes('', [1, 1, 2, 2]);

       $reflectionClass = new \ReflectionClass(GenresHasCategories::class);
       $reflectionProperty = $reflectionClass->getProperty('genresId');
       $reflectionProperty->setAccessible(true);

       $genresId = $reflectionProperty->getValue($rule);
       $this->assertEqualsCanonicalizing([1, 2], $genresId);
    }

    public function testPassesReturnsFalseWhenCategoriesOrGenresArrayEmpty()
    {
        $rule = $this->createRuleMock([]);
        $rule   
            ->shouldReceive('getRows')
            ->withAnyArgs()
            ->andReturn(collect());
        $this->assertFalse($rule->passes('', [1]));
    }

    public function testPassesReturnsFalseWhenGetRowsIsEmpty()
    {
        $rule = $this->createRuleMock([1]);
        $rule   
            ->shouldReceive('getRows')
            ->withAnyArgs()
            ->andReturn(collect());
        $this->assertFalse($rule->passes('', [1]));
        
        //$rule = $this->createRuleMock([]);
        //$this->assertFalse($rule->passes('', [1]));
    }

    public function testPassesReturnsFalseWhenCategoriesWithoutGenres()
    {
        $rule = $this->createRuleMock([1, 2]);
        $rule   
            ->shouldReceive('getRows')
            ->withAnyArgs()
            ->andReturn(collect(['category_id' => 1]));
        $this->assertFalse($rule->passes('', [1]));
    }

    public function testPassesValid(){
        $rule = $this->createRuleMock([1, 2]);
        $rule   
            ->shouldReceive('getRows')
            ->withAnyArgs()
            ->andReturn(collect(
                ['category_id' => 1],
                ['category_id' => 2]
            ));
        $this->assertTrue($rule->passes('', [1]));

        $rule = $this->createRuleMock([1, 2]);
        $rule   
            ->shouldReceive('getRows')
            ->withAnyArgs()
            ->andReturn(collect(
                ['category_id' => 1],
                ['category_id' => 2],
                ['category_id' => 1],
                ['category_id' => 2]
            ));
        $this->assertTrue($rule->passes('', [1]));
    }

    protected function createRuleMock(array $categoriesId): MockInterface{
       return \Mockery::mock(GenresHasCategories::class, [$categoriesId])
        ->makePartial()
        ->shouldAllowMockingProtectedMethods();
    }
}
