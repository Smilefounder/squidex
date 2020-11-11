/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Input, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { AppLanguageDto, ArrayFieldPropertiesDto, EditContentForm, FieldArrayForm, FieldArrayItemForm, sorted } from '@app/shared';
import { ArrayItemComponent } from './array-item.component';

@Component({
    selector: 'sqx-array-editor',
    styleUrls: ['./array-editor.component.scss'],
    templateUrl: './array-editor.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrayEditorComponent implements OnChanges {
    @Input()
    public form: EditContentForm;

    @Input()
    public formContext: any;

    @Input()
    public formModel: FieldArrayForm;

    @Input()
    public canUnset: boolean;

    @Input()
    public language: AppLanguageDto;

    @Input()
    public languages: ReadonlyArray<AppLanguageDto>;

    @ViewChildren(ArrayItemComponent)
    public children: QueryList<ArrayItemComponent>;

    public maxItems: number;

    public get field() {
        return this.formModel.field;
    }

    public get hasFields() {
        return this.field.nested.length > 0;
    }

    public get canAdd() {
        return this.formModel.items.length < this.maxItems;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['formModel']) {
            const properties = this.field.properties as ArrayFieldPropertiesDto;

            this.maxItems = properties.maxItems || Number.MAX_VALUE;
        }
    }

    public itemRemove(index: number) {
        this.formModel.removeItemAt(index);
    }

    public itemAdd(value?: FieldArrayItemForm) {
        this.formModel.addItem(value);
    }

    public sort(event: CdkDragDrop<ReadonlyArray<FieldArrayItemForm>>) {
        this.formModel.sort(sorted(event));

        this.reset();
    }

    public move(index: number, item: FieldArrayItemForm) {
        this.formModel.move(index, item);

        this.reset();
    }

    public collapseAll() {
        this.children.forEach(child => {
            child.collapse();
        });
    }

    public expandAll() {
        this.children.forEach(child => {
            child.expand();
        });
    }

    private reset() {
        this.children.forEach(child => {
            child.reset();
        });
    }
}