import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IngredientEntity } from './IngredientEntity';
import { RecipeEntity } from './RecipeEntity';

@Entity({
	name: 'recipe_ingredient'
})
export class RecipeIngredientEntity {
    @PrimaryColumn('uuid')
    	id!: string;

    @Column()
    	quantity!: number;

    @ManyToOne(() => RecipeEntity, (recipe) => recipe.ingredients)
    @JoinColumn({ name: 'recipeId' })
    	recipe!: RecipeEntity;

    @ManyToOne(() => IngredientEntity, (ingredient) => ingredient.recipes)
    @JoinColumn({ name: 'ingredientId' })
    	ingredient!: IngredientEntity;
}
