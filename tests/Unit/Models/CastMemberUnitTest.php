<?php

namespace Tests\Unit\Models;

use App\Models\CastMember;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CastMemberUnitTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */

    private $casts;

    protected function setUp(): void{
        parent::setUp();
        $this->casts = new CastMember();
    }


    public function testFillable()
    {
        $fillable =  ['name', 'type'];
        $this->assertEquals(
            $fillable,
            $this->casts->getFillable()
        );
    }

    public function testIfUseTraits(){
        $traits = [
            SoftDeletes::class,
            Uuid::class
        ];

        $castTraits = array_keys(class_uses(CastMember::class));

        $this->assertEquals($traits, $castTraits);

    }

    public function testCasts()
    {
        $cast = ['id' => 'string'];
        $this->assertEquals(
            $cast,
            $this->casts->getCasts()
        );
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        foreach($dates as $date){
            $this->assertContains($date, $this->casts->getDates());
        }
        $this->assertCount(count($dates), $this->casts->getDates());
    }
}
