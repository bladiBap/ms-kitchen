import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IngredientEntity } from './Ingredient';
import { RecipeEntity } from './Recipe';

@Entity({
	name: 'recipe_ingredient'
})
export class RecipeIngredientEntity {
    @PrimaryGeneratedColumn()
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
