import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { PackageEntity } from './Package';
import { RecipeEntity } from './Recipe';

@Entity({
	name: 'package_item'
})
export class PackageItemEntity {
    @PrimaryGeneratedColumn()
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
