import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { PackageEntity } from './PackageEntity';
import { RecipeEntity } from './RecipeEntity';

@Entity({
	name: 'package_item'
})
export class PackageItemEntity {
    @PrimaryColumn('uuid')
    	id!: string;

    @Column()
    	quantity!: number;

    @ManyToOne(() => PackageEntity, pack=> pack.packageItems)
    @JoinColumn({ name: 'packageId' })
    	package!: PackageEntity;

    @ManyToOne(() => RecipeEntity, recipe => recipe.packageItems)
    @JoinColumn({ name: 'recipeId' })
    	recipe!: RecipeEntity;

    @Column()
    	recipeId!: string;

    @Column()
    	packageId!: string;

}
