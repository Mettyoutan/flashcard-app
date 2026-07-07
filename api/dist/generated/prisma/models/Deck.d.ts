import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type DeckModel = runtime.Types.Result.DefaultSelection<Prisma.$DeckPayload>;
export type AggregateDeck = {
    _count: DeckCountAggregateOutputType | null;
    _min: DeckMinAggregateOutputType | null;
    _max: DeckMaxAggregateOutputType | null;
};
export type DeckMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    title: string | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DeckMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    title: string | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DeckCountAggregateOutputType = {
    id: number;
    userId: number;
    title: number;
    description: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type DeckMinAggregateInputType = {
    id?: true;
    userId?: true;
    title?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DeckMaxAggregateInputType = {
    id?: true;
    userId?: true;
    title?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DeckCountAggregateInputType = {
    id?: true;
    userId?: true;
    title?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type DeckAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DeckWhereInput;
    orderBy?: Prisma.DeckOrderByWithRelationInput | Prisma.DeckOrderByWithRelationInput[];
    cursor?: Prisma.DeckWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DeckCountAggregateInputType;
    _min?: DeckMinAggregateInputType;
    _max?: DeckMaxAggregateInputType;
};
export type GetDeckAggregateType<T extends DeckAggregateArgs> = {
    [P in keyof T & keyof AggregateDeck]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDeck[P]> : Prisma.GetScalarType<T[P], AggregateDeck[P]>;
};
export type DeckGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DeckWhereInput;
    orderBy?: Prisma.DeckOrderByWithAggregationInput | Prisma.DeckOrderByWithAggregationInput[];
    by: Prisma.DeckScalarFieldEnum[] | Prisma.DeckScalarFieldEnum;
    having?: Prisma.DeckScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DeckCountAggregateInputType | true;
    _min?: DeckMinAggregateInputType;
    _max?: DeckMaxAggregateInputType;
};
export type DeckGroupByOutputType = {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: DeckCountAggregateOutputType | null;
    _min: DeckMinAggregateOutputType | null;
    _max: DeckMaxAggregateOutputType | null;
};
type GetDeckGroupByPayload<T extends DeckGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DeckGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DeckGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DeckGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DeckGroupByOutputType[P]>;
}>>;
export type DeckWhereInput = {
    AND?: Prisma.DeckWhereInput | Prisma.DeckWhereInput[];
    OR?: Prisma.DeckWhereInput[];
    NOT?: Prisma.DeckWhereInput | Prisma.DeckWhereInput[];
    id?: Prisma.UuidFilter<"Deck"> | string;
    userId?: Prisma.UuidFilter<"Deck"> | string;
    title?: Prisma.StringFilter<"Deck"> | string;
    description?: Prisma.StringNullableFilter<"Deck"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Deck"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Deck"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    cards?: Prisma.CardListRelationFilter;
};
export type DeckOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    cards?: Prisma.CardOrderByRelationAggregateInput;
};
export type DeckWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.DeckWhereInput | Prisma.DeckWhereInput[];
    OR?: Prisma.DeckWhereInput[];
    NOT?: Prisma.DeckWhereInput | Prisma.DeckWhereInput[];
    userId?: Prisma.UuidFilter<"Deck"> | string;
    title?: Prisma.StringFilter<"Deck"> | string;
    description?: Prisma.StringNullableFilter<"Deck"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Deck"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Deck"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    cards?: Prisma.CardListRelationFilter;
}, "id">;
export type DeckOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.DeckCountOrderByAggregateInput;
    _max?: Prisma.DeckMaxOrderByAggregateInput;
    _min?: Prisma.DeckMinOrderByAggregateInput;
};
export type DeckScalarWhereWithAggregatesInput = {
    AND?: Prisma.DeckScalarWhereWithAggregatesInput | Prisma.DeckScalarWhereWithAggregatesInput[];
    OR?: Prisma.DeckScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DeckScalarWhereWithAggregatesInput | Prisma.DeckScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Deck"> | string;
    userId?: Prisma.UuidWithAggregatesFilter<"Deck"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Deck"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Deck"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Deck"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Deck"> | Date | string;
};
export type DeckCreateInput = {
    id?: string;
    title: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutDecksInput;
    cards?: Prisma.CardCreateNestedManyWithoutDeckInput;
};
export type DeckUncheckedCreateInput = {
    id?: string;
    userId: string;
    title: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    cards?: Prisma.CardUncheckedCreateNestedManyWithoutDeckInput;
};
export type DeckUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutDecksNestedInput;
    cards?: Prisma.CardUpdateManyWithoutDeckNestedInput;
};
export type DeckUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cards?: Prisma.CardUncheckedUpdateManyWithoutDeckNestedInput;
};
export type DeckCreateManyInput = {
    id?: string;
    userId: string;
    title: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DeckUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DeckUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DeckListRelationFilter = {
    every?: Prisma.DeckWhereInput;
    some?: Prisma.DeckWhereInput;
    none?: Prisma.DeckWhereInput;
};
export type DeckOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DeckCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DeckMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DeckMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DeckScalarRelationFilter = {
    is?: Prisma.DeckWhereInput;
    isNot?: Prisma.DeckWhereInput;
};
export type DeckCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.DeckCreateWithoutUserInput, Prisma.DeckUncheckedCreateWithoutUserInput> | Prisma.DeckCreateWithoutUserInput[] | Prisma.DeckUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.DeckCreateOrConnectWithoutUserInput | Prisma.DeckCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.DeckCreateManyUserInputEnvelope;
    connect?: Prisma.DeckWhereUniqueInput | Prisma.DeckWhereUniqueInput[];
};
export type DeckUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.DeckCreateWithoutUserInput, Prisma.DeckUncheckedCreateWithoutUserInput> | Prisma.DeckCreateWithoutUserInput[] | Prisma.DeckUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.DeckCreateOrConnectWithoutUserInput | Prisma.DeckCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.DeckCreateManyUserInputEnvelope;
    connect?: Prisma.DeckWhereUniqueInput | Prisma.DeckWhereUniqueInput[];
};
export type DeckUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.DeckCreateWithoutUserInput, Prisma.DeckUncheckedCreateWithoutUserInput> | Prisma.DeckCreateWithoutUserInput[] | Prisma.DeckUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.DeckCreateOrConnectWithoutUserInput | Prisma.DeckCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.DeckUpsertWithWhereUniqueWithoutUserInput | Prisma.DeckUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.DeckCreateManyUserInputEnvelope;
    set?: Prisma.DeckWhereUniqueInput | Prisma.DeckWhereUniqueInput[];
    disconnect?: Prisma.DeckWhereUniqueInput | Prisma.DeckWhereUniqueInput[];
    delete?: Prisma.DeckWhereUniqueInput | Prisma.DeckWhereUniqueInput[];
    connect?: Prisma.DeckWhereUniqueInput | Prisma.DeckWhereUniqueInput[];
    update?: Prisma.DeckUpdateWithWhereUniqueWithoutUserInput | Prisma.DeckUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.DeckUpdateManyWithWhereWithoutUserInput | Prisma.DeckUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.DeckScalarWhereInput | Prisma.DeckScalarWhereInput[];
};
export type DeckUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.DeckCreateWithoutUserInput, Prisma.DeckUncheckedCreateWithoutUserInput> | Prisma.DeckCreateWithoutUserInput[] | Prisma.DeckUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.DeckCreateOrConnectWithoutUserInput | Prisma.DeckCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.DeckUpsertWithWhereUniqueWithoutUserInput | Prisma.DeckUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.DeckCreateManyUserInputEnvelope;
    set?: Prisma.DeckWhereUniqueInput | Prisma.DeckWhereUniqueInput[];
    disconnect?: Prisma.DeckWhereUniqueInput | Prisma.DeckWhereUniqueInput[];
    delete?: Prisma.DeckWhereUniqueInput | Prisma.DeckWhereUniqueInput[];
    connect?: Prisma.DeckWhereUniqueInput | Prisma.DeckWhereUniqueInput[];
    update?: Prisma.DeckUpdateWithWhereUniqueWithoutUserInput | Prisma.DeckUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.DeckUpdateManyWithWhereWithoutUserInput | Prisma.DeckUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.DeckScalarWhereInput | Prisma.DeckScalarWhereInput[];
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type DeckCreateNestedOneWithoutCardsInput = {
    create?: Prisma.XOR<Prisma.DeckCreateWithoutCardsInput, Prisma.DeckUncheckedCreateWithoutCardsInput>;
    connectOrCreate?: Prisma.DeckCreateOrConnectWithoutCardsInput;
    connect?: Prisma.DeckWhereUniqueInput;
};
export type DeckUpdateOneRequiredWithoutCardsNestedInput = {
    create?: Prisma.XOR<Prisma.DeckCreateWithoutCardsInput, Prisma.DeckUncheckedCreateWithoutCardsInput>;
    connectOrCreate?: Prisma.DeckCreateOrConnectWithoutCardsInput;
    upsert?: Prisma.DeckUpsertWithoutCardsInput;
    connect?: Prisma.DeckWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DeckUpdateToOneWithWhereWithoutCardsInput, Prisma.DeckUpdateWithoutCardsInput>, Prisma.DeckUncheckedUpdateWithoutCardsInput>;
};
export type DeckCreateWithoutUserInput = {
    id?: string;
    title: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    cards?: Prisma.CardCreateNestedManyWithoutDeckInput;
};
export type DeckUncheckedCreateWithoutUserInput = {
    id?: string;
    title: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    cards?: Prisma.CardUncheckedCreateNestedManyWithoutDeckInput;
};
export type DeckCreateOrConnectWithoutUserInput = {
    where: Prisma.DeckWhereUniqueInput;
    create: Prisma.XOR<Prisma.DeckCreateWithoutUserInput, Prisma.DeckUncheckedCreateWithoutUserInput>;
};
export type DeckCreateManyUserInputEnvelope = {
    data: Prisma.DeckCreateManyUserInput | Prisma.DeckCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type DeckUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.DeckWhereUniqueInput;
    update: Prisma.XOR<Prisma.DeckUpdateWithoutUserInput, Prisma.DeckUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.DeckCreateWithoutUserInput, Prisma.DeckUncheckedCreateWithoutUserInput>;
};
export type DeckUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.DeckWhereUniqueInput;
    data: Prisma.XOR<Prisma.DeckUpdateWithoutUserInput, Prisma.DeckUncheckedUpdateWithoutUserInput>;
};
export type DeckUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.DeckScalarWhereInput;
    data: Prisma.XOR<Prisma.DeckUpdateManyMutationInput, Prisma.DeckUncheckedUpdateManyWithoutUserInput>;
};
export type DeckScalarWhereInput = {
    AND?: Prisma.DeckScalarWhereInput | Prisma.DeckScalarWhereInput[];
    OR?: Prisma.DeckScalarWhereInput[];
    NOT?: Prisma.DeckScalarWhereInput | Prisma.DeckScalarWhereInput[];
    id?: Prisma.UuidFilter<"Deck"> | string;
    userId?: Prisma.UuidFilter<"Deck"> | string;
    title?: Prisma.StringFilter<"Deck"> | string;
    description?: Prisma.StringNullableFilter<"Deck"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Deck"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Deck"> | Date | string;
};
export type DeckCreateWithoutCardsInput = {
    id?: string;
    title: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutDecksInput;
};
export type DeckUncheckedCreateWithoutCardsInput = {
    id?: string;
    userId: string;
    title: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DeckCreateOrConnectWithoutCardsInput = {
    where: Prisma.DeckWhereUniqueInput;
    create: Prisma.XOR<Prisma.DeckCreateWithoutCardsInput, Prisma.DeckUncheckedCreateWithoutCardsInput>;
};
export type DeckUpsertWithoutCardsInput = {
    update: Prisma.XOR<Prisma.DeckUpdateWithoutCardsInput, Prisma.DeckUncheckedUpdateWithoutCardsInput>;
    create: Prisma.XOR<Prisma.DeckCreateWithoutCardsInput, Prisma.DeckUncheckedCreateWithoutCardsInput>;
    where?: Prisma.DeckWhereInput;
};
export type DeckUpdateToOneWithWhereWithoutCardsInput = {
    where?: Prisma.DeckWhereInput;
    data: Prisma.XOR<Prisma.DeckUpdateWithoutCardsInput, Prisma.DeckUncheckedUpdateWithoutCardsInput>;
};
export type DeckUpdateWithoutCardsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutDecksNestedInput;
};
export type DeckUncheckedUpdateWithoutCardsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DeckCreateManyUserInput = {
    id?: string;
    title: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DeckUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cards?: Prisma.CardUpdateManyWithoutDeckNestedInput;
};
export type DeckUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cards?: Prisma.CardUncheckedUpdateManyWithoutDeckNestedInput;
};
export type DeckUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DeckCountOutputType = {
    cards: number;
};
export type DeckCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    cards?: boolean | DeckCountOutputTypeCountCardsArgs;
};
export type DeckCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeckCountOutputTypeSelect<ExtArgs> | null;
};
export type DeckCountOutputTypeCountCardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CardWhereInput;
};
export type DeckSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    title?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    cards?: boolean | Prisma.Deck$cardsArgs<ExtArgs>;
    _count?: boolean | Prisma.DeckCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["deck"]>;
export type DeckSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    title?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["deck"]>;
export type DeckSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    title?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["deck"]>;
export type DeckSelectScalar = {
    id?: boolean;
    userId?: boolean;
    title?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type DeckOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "title" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["deck"]>;
export type DeckInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    cards?: boolean | Prisma.Deck$cardsArgs<ExtArgs>;
    _count?: boolean | Prisma.DeckCountOutputTypeDefaultArgs<ExtArgs>;
};
export type DeckIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type DeckIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $DeckPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Deck";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        cards: Prisma.$CardPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["deck"]>;
    composites: {};
};
export type DeckGetPayload<S extends boolean | null | undefined | DeckDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DeckPayload, S>;
export type DeckCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DeckFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DeckCountAggregateInputType | true;
};
export interface DeckDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Deck'];
        meta: {
            name: 'Deck';
        };
    };
    findUnique<T extends DeckFindUniqueArgs>(args: Prisma.SelectSubset<T, DeckFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DeckClient<runtime.Types.Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DeckFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DeckFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DeckClient<runtime.Types.Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DeckFindFirstArgs>(args?: Prisma.SelectSubset<T, DeckFindFirstArgs<ExtArgs>>): Prisma.Prisma__DeckClient<runtime.Types.Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DeckFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DeckFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DeckClient<runtime.Types.Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DeckFindManyArgs>(args?: Prisma.SelectSubset<T, DeckFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DeckCreateArgs>(args: Prisma.SelectSubset<T, DeckCreateArgs<ExtArgs>>): Prisma.Prisma__DeckClient<runtime.Types.Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DeckCreateManyArgs>(args?: Prisma.SelectSubset<T, DeckCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DeckCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DeckCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DeckDeleteArgs>(args: Prisma.SelectSubset<T, DeckDeleteArgs<ExtArgs>>): Prisma.Prisma__DeckClient<runtime.Types.Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DeckUpdateArgs>(args: Prisma.SelectSubset<T, DeckUpdateArgs<ExtArgs>>): Prisma.Prisma__DeckClient<runtime.Types.Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DeckDeleteManyArgs>(args?: Prisma.SelectSubset<T, DeckDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DeckUpdateManyArgs>(args: Prisma.SelectSubset<T, DeckUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DeckUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DeckUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DeckUpsertArgs>(args: Prisma.SelectSubset<T, DeckUpsertArgs<ExtArgs>>): Prisma.Prisma__DeckClient<runtime.Types.Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DeckCountArgs>(args?: Prisma.Subset<T, DeckCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DeckCountAggregateOutputType> : number>;
    aggregate<T extends DeckAggregateArgs>(args: Prisma.Subset<T, DeckAggregateArgs>): Prisma.PrismaPromise<GetDeckAggregateType<T>>;
    groupBy<T extends DeckGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DeckGroupByArgs['orderBy'];
    } : {
        orderBy?: DeckGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DeckGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeckGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DeckFieldRefs;
}
export interface Prisma__DeckClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    cards<T extends Prisma.Deck$cardsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Deck$cardsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DeckFieldRefs {
    readonly id: Prisma.FieldRef<"Deck", 'String'>;
    readonly userId: Prisma.FieldRef<"Deck", 'String'>;
    readonly title: Prisma.FieldRef<"Deck", 'String'>;
    readonly description: Prisma.FieldRef<"Deck", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Deck", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Deck", 'DateTime'>;
}
export type DeckFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeckSelect<ExtArgs> | null;
    omit?: Prisma.DeckOmit<ExtArgs> | null;
    include?: Prisma.DeckInclude<ExtArgs> | null;
    where: Prisma.DeckWhereUniqueInput;
};
export type DeckFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeckSelect<ExtArgs> | null;
    omit?: Prisma.DeckOmit<ExtArgs> | null;
    include?: Prisma.DeckInclude<ExtArgs> | null;
    where: Prisma.DeckWhereUniqueInput;
};
export type DeckFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeckSelect<ExtArgs> | null;
    omit?: Prisma.DeckOmit<ExtArgs> | null;
    include?: Prisma.DeckInclude<ExtArgs> | null;
    where?: Prisma.DeckWhereInput;
    orderBy?: Prisma.DeckOrderByWithRelationInput | Prisma.DeckOrderByWithRelationInput[];
    cursor?: Prisma.DeckWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DeckScalarFieldEnum | Prisma.DeckScalarFieldEnum[];
};
export type DeckFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeckSelect<ExtArgs> | null;
    omit?: Prisma.DeckOmit<ExtArgs> | null;
    include?: Prisma.DeckInclude<ExtArgs> | null;
    where?: Prisma.DeckWhereInput;
    orderBy?: Prisma.DeckOrderByWithRelationInput | Prisma.DeckOrderByWithRelationInput[];
    cursor?: Prisma.DeckWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DeckScalarFieldEnum | Prisma.DeckScalarFieldEnum[];
};
export type DeckFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeckSelect<ExtArgs> | null;
    omit?: Prisma.DeckOmit<ExtArgs> | null;
    include?: Prisma.DeckInclude<ExtArgs> | null;
    where?: Prisma.DeckWhereInput;
    orderBy?: Prisma.DeckOrderByWithRelationInput | Prisma.DeckOrderByWithRelationInput[];
    cursor?: Prisma.DeckWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DeckScalarFieldEnum | Prisma.DeckScalarFieldEnum[];
};
export type DeckCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeckSelect<ExtArgs> | null;
    omit?: Prisma.DeckOmit<ExtArgs> | null;
    include?: Prisma.DeckInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DeckCreateInput, Prisma.DeckUncheckedCreateInput>;
};
export type DeckCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DeckCreateManyInput | Prisma.DeckCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DeckCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeckSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DeckOmit<ExtArgs> | null;
    data: Prisma.DeckCreateManyInput | Prisma.DeckCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.DeckIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type DeckUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeckSelect<ExtArgs> | null;
    omit?: Prisma.DeckOmit<ExtArgs> | null;
    include?: Prisma.DeckInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DeckUpdateInput, Prisma.DeckUncheckedUpdateInput>;
    where: Prisma.DeckWhereUniqueInput;
};
export type DeckUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DeckUpdateManyMutationInput, Prisma.DeckUncheckedUpdateManyInput>;
    where?: Prisma.DeckWhereInput;
    limit?: number;
};
export type DeckUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeckSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DeckOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DeckUpdateManyMutationInput, Prisma.DeckUncheckedUpdateManyInput>;
    where?: Prisma.DeckWhereInput;
    limit?: number;
    include?: Prisma.DeckIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type DeckUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeckSelect<ExtArgs> | null;
    omit?: Prisma.DeckOmit<ExtArgs> | null;
    include?: Prisma.DeckInclude<ExtArgs> | null;
    where: Prisma.DeckWhereUniqueInput;
    create: Prisma.XOR<Prisma.DeckCreateInput, Prisma.DeckUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DeckUpdateInput, Prisma.DeckUncheckedUpdateInput>;
};
export type DeckDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeckSelect<ExtArgs> | null;
    omit?: Prisma.DeckOmit<ExtArgs> | null;
    include?: Prisma.DeckInclude<ExtArgs> | null;
    where: Prisma.DeckWhereUniqueInput;
};
export type DeckDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DeckWhereInput;
    limit?: number;
};
export type Deck$cardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardSelect<ExtArgs> | null;
    omit?: Prisma.CardOmit<ExtArgs> | null;
    include?: Prisma.CardInclude<ExtArgs> | null;
    where?: Prisma.CardWhereInput;
    orderBy?: Prisma.CardOrderByWithRelationInput | Prisma.CardOrderByWithRelationInput[];
    cursor?: Prisma.CardWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CardScalarFieldEnum | Prisma.CardScalarFieldEnum[];
};
export type DeckDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DeckSelect<ExtArgs> | null;
    omit?: Prisma.DeckOmit<ExtArgs> | null;
    include?: Prisma.DeckInclude<ExtArgs> | null;
};
export {};
