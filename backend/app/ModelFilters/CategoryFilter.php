<?php

namespace App\ModelFilters;

use EloquentFilter\ModelFilter;

class CategoryFilter extends ModelFilter
{
    public $relations = [];

    public function search($search)
    {
        $this->query->where('name', 'LIKE', "%$search%");
    }
}
