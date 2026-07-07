import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CardModel = runtime.Types.Result.DefaultSelection<Prisma.$CardPayload>;
export type AggregateCard = {
    _count: CardCountAggregateOutputType | null;
    _min: CardMinAggregateOutputType | null;
    _max: CardMaxAggregateOutputType | null;
};
export type CardMinAggregateOutputType = {
    id: string | null;
    deckId: string | null;
    front: string | null;
    back: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CardMaxAggregateOutputType = {
    id: string | null;
    deckId: string | null;
    front: string | null;
    back: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CardCountAggregateOutputType = {
    id: number;
    deckId: number;
    front: number;
    back: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type CardMinAggregateInputType = {
    id?: true;
    deckId?: true;
    front?: true;
    back?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CardMaxAggregateInputType = {
    id?: true;
    deckId?: true;
    front?: true;
    back?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CardCountAggregateInputType = {
    id?: true;
    deckId?: true;
    front?: true;
    back?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type CardAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CardWhereInput;
    orderBy?: Prisma.CardOrderByWithRelationInput | Prisma.CardOrderByWithRelationInput[];
    cursor?: Prisma.CardWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CardCountAggregateInputType;
    _min?: CardMinAggregateInputType;
    _max?: CardMaxAggregateInputType;
};
export type GetCardAggregateType<T extends CardAggregateArgs> = {
    [P in keyof T & keyof AggregateCard]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCard[P]> : Prisma.GetScalarType<T[P], AggregateCard[P]>;
};
export type CardGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CardWhereInput;
    orderBy?: Prisma.CardOrderByWithAggregationInput | Prisma.CardOrderByWithAggregationInput[];
    by: Prisma.CardScalarFieldEnum[] | Prisma.CardScalarFieldEnum;
    having?: Prisma.CardScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CardCountAggregateInputType | true;
    _min?: CardMinAggregateInputType;
    _max?: CardMaxAggregateInputType;
};
export type CardGroupByOutputType = {
    id: string;
    deckId: string;
    front: string;
    back: string;
    createdAt: Date;
    updatedAt: Date;
    _count: CardCountAggregateOutputType | null;
    _min: CardMinAggregateOutputType | null;
    _max: CardMaxAggregateOutputType | null;
};
type GetCardGroupByPayload<T extends CardGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CardGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CardGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CardGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CardGroupByOutputType[P]>;
}>>;
export type CardWhereInput = {
    AND?: Prisma.CardWhereInput | Prisma.CardWhereInput[];
    OR?: Prisma.CardWhereInput[];
    NOT?: Prisma.CardWhereInput | Prisma.CardWhereInput[];
    id?: Prisma.UuidFilter<"Card"> | string;
    deckId?: Prisma.UuidFilter<"Card"> | string;
    front?: Prisma.StringFilter<"Card"> | string;
    back?: Prisma.StringFilter<"Card"> | string;
    createdAt?: Prisma.DateTimeFilter<"Card"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Card"> | Date | string;
    deck?: Prisma.XOR<Prisma.DeckScalarRelationFilter, Prisma.DeckWhereInput>;
};
export type CardOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    deckId?: Prisma.SortOrder;
    front?: Prisma.SortOrder;
    back?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deck?: Prisma.DeckOrderByWithRelationInput;
};
export type CardWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.CardWhereInput | Prisma.CardWhereInput[];
    OR?: Prisma.CardWhereInput[];
    NOT?: Prisma.CardWhereInput | Prisma.CardWhereInput[];
    deckId?: Prisma.UuidFilter<"Card"> | string;
    front?: Prisma.StringFilter<"Card"> | string;
    back?: Prisma.StringFilter<"Card"> | string;
    createdAt?: Prisma.DateTimeFilter<"Card"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Card"> | Date | string;
    deck?: Prisma.XOR<Prisma.DeckScalarRelationFilter, Prisma.DeckWhereInput>;
}, "id">;
export type CardOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    deckId?: Prisma.SortOrder;
    front?: Prisma.SortOrder;
    back?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.CardCountOrderByAggregateInput;
    _max?: Prisma.CardMaxOrderByAggregateInput;
    _min?: Prisma.CardMinOrderByAggregateInput;
};
export type CardScalarWhereWithAggregatesInput = {
    AND?: Prisma.CardScalarWhereWithAggregatesInput | Prisma.CardScalarWhereWithAggregatesInput[];
    OR?: Prisma.CardScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CardScalarWhereWithAggregatesInput | Prisma.CardScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Card"> | string;
    deckId?: Prisma.UuidWithAggregatesFilter<"Card"> | string;
    front?: Prisma.StringWithAggregatesFilter<"Card"> | string;
    back?: Prisma.StringWithAggregatesFilter<"Card"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Card"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Card"> | Date | string;
};
export type CardCreateInput = {
    id?: string;
    front: string;
    back: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deck: Prisma.DeckCreateNestedOneWithoutCardsInput;
};
export type CardUncheckedCreateInput = {
    id?: string;
    deckId: string;
    front: string;
    back: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CardUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    front?: Prisma.StringFieldUpdateOperationsInput | string;
    back?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deck?: Prisma.DeckUpdateOneRequiredWithoutCardsNestedInput;
};
export type CardUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    deckId?: Prisma.StringFieldUpdateOperationsInput | string;
    front?: Prisma.StringFieldUpdateOperationsInput | string;
    back?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CardCreateManyInput = {
    id?: string;
    deckId: string;
    front: string;
    back: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CardUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    front?: Prisma.StringFieldUpdateOperationsInput | string;
    back?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CardUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    deckId?: Prisma.StringFieldUpdateOperationsInput | string;
    front?: Prisma.StringFieldUpdateOperationsInput | string;
    back?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CardListRelationFilter = {
    every?: Prisma.CardWhereInput;
    some?: Prisma.CardWhereInput;
    none?: Prisma.CardWhereInput;
};
export type CardOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CardCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    deckId?: Prisma.SortOrder;
    front?: Prisma.SortOrder;
    back?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CardMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    deckId?: Prisma.SortOrder;
    front?: Prisma.SortOrder;
    back?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CardMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    deckId?: Prisma.SortOrder;
    front?: Prisma.SortOrder;
    back?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CardCreateNestedManyWithoutDeckInput = {
    create?: Prisma.XOR<Prisma.CardCreateWithoutDeckInput, Prisma.CardUncheckedCreateWithoutDeckInput> | Prisma.CardCreateWithoutDeckInput[] | Prisma.CardUncheckedCreateWithoutDeckInput[];
    connectOrCreate?: Prisma.CardCreateOrConnectWithoutDeckInput | Prisma.CardCreateOrConnectWithoutDeckInput[];
    createMany?: Prisma.CardCreateManyDeckInputEnvelope;
    connect?: Prisma.CardWhereUniqueInput | Prisma.CardWhereUniqueInput[];
};
export type CardUncheckedCreateNestedManyWithoutDeckInput = {
    create?: Prisma.XOR<Prisma.CardCreateWithoutDeckInput, Prisma.CardUncheckedCreateWithoutDeckInput> | Prisma.CardCreateWithoutDeckInput[] | Prisma.CardUncheckedCreateWithoutDeckInput[];
    connectOrCreate?: Prisma.CardCreateOrConnectWithoutDeckInput | Prisma.CardCreateOrConnectWithoutDeckInput[];
    createMany?: Prisma.CardCreateManyDeckInputEnvelope;
    connect?: Prisma.CardWhereUniqueInput | Prisma.CardWhereUniqueInput[];
};
export type CardUpdateManyWithoutDeckNestedInput = {
    create?: Prisma.XOR<Prisma.CardCreateWithoutDeckInput, Prisma.CardUncheckedCreateWithoutDeckInput> | Prisma.CardCreateWithoutDeckInput[] | Prisma.CardUncheckedCreateWithoutDeckInput[];
    connectOrCreate?: Prisma.CardCreateOrConnectWithoutDeckInput | Prisma.CardCreateOrConnectWithoutDeckInput[];
    upsert?: Prisma.CardUpsertWithWhereUniqueWithoutDeckInput | Prisma.CardUpsertWithWhereUniqueWithoutDeckInput[];
    createMany?: Prisma.CardCreateManyDeckInputEnvelope;
    set?: Prisma.CardWhereUniqueInput | Prisma.CardWhereUniqueInput[];
    disconnect?: Prisma.CardWhereUniqueInput | Prisma.CardWhereUniqueInput[];
    delete?: Prisma.CardWhereUniqueInput | Prisma.CardWhereUniqueInput[];
    connect?: Prisma.CardWhereUniqueInput | Prisma.CardWhereUniqueInput[];
    update?: Prisma.CardUpdateWithWhereUniqueWithoutDeckInput | Prisma.CardUpdateWithWhereUniqueWithoutDeckInput[];
    updateMany?: Prisma.CardUpdateManyWithWhereWithoutDeckInput | Prisma.CardUpdateManyWithWhereWithoutDeckInput[];
    deleteMany?: Prisma.CardScalarWhereInput | Prisma.CardScalarWhereInput[];
};
export type CardUncheckedUpdateManyWithoutDeckNestedInput = {
    create?: Prisma.XOR<Prisma.CardCreateWithoutDeckInput, Prisma.CardUncheckedCreateWithoutDeckInput> | Prisma.CardCreateWithoutDeckInput[] | Prisma.CardUncheckedCreateWithoutDeckInput[];
    connectOrCreate?: Prisma.CardCreateOrConnectWithoutDeckInput | Prisma.CardCreateOrConnectWithoutDeckInput[];
    upsert?: Prisma.CardUpsertWithWhereUniqueWithoutDeckInput | Prisma.CardUpsertWithWhereUniqueWithoutDeckInput[];
    createMany?: Prisma.CardCreateManyDeckInputEnvelope;
    set?: Prisma.CardWhereUniqueInput | Prisma.CardWhereUniqueInput[];
    disconnect?: Prisma.CardWhereUniqueInput | Prisma.CardWhereUniqueInput[];
    delete?: Prisma.CardWhereUniqueInput | Prisma.CardWhereUniqueInput[];
    connect?: Prisma.CardWhereUniqueInput | Prisma.CardWhereUniqueInput[];
    update?: Prisma.CardUpdateWithWhereUniqueWithoutDeckInput | Prisma.CardUpdateWithWhereUniqueWithoutDeckInput[];
    updateMany?: Prisma.CardUpdateManyWithWhereWithoutDeckInput | Prisma.CardUpdateManyWithWhereWithoutDeckInput[];
    deleteMany?: Prisma.CardScalarWhereInput | Prisma.CardScalarWhereInput[];
};
export type CardCreateWithoutDeckInput = {
    id?: string;
    front: string;
    back: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CardUncheckedCreateWithoutDeckInput = {
    id?: string;
    front: string;
    back: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CardCreateOrConnectWithoutDeckInput = {
    where: Prisma.CardWhereUniqueInput;
    create: Prisma.XOR<Prisma.CardCreateWithoutDeckInput, Prisma.CardUncheckedCreateWithoutDeckInput>;
};
export type CardCreateManyDeckInputEnvelope = {
    data: Prisma.CardCreateManyDeckInput | Prisma.CardCreateManyDeckInput[];
    skipDuplicates?: boolean;
};
export type CardUpsertWithWhereUniqueWithoutDeckInput = {
    where: Prisma.CardWhereUniqueInput;
    update: Prisma.XOR<Prisma.CardUpdateWithoutDeckInput, Prisma.CardUncheckedUpdateWithoutDeckInput>;
    create: Prisma.XOR<Prisma.CardCreateWithoutDeckInput, Prisma.CardUncheckedCreateWithoutDeckInput>;
};
export type CardUpdateWithWhereUniqueWithoutDeckInput = {
    where: Prisma.CardWhereUniqueInput;
    data: Prisma.XOR<Prisma.CardUpdateWithoutDeckInput, Prisma.CardUncheckedUpdateWithoutDeckInput>;
};
export type CardUpdateManyWithWhereWithoutDeckInput = {
    where: Prisma.CardScalarWhereInput;
    data: Prisma.XOR<Prisma.CardUpdateManyMutationInput, Prisma.CardUncheckedUpdateManyWithoutDeckInput>;
};
export type CardScalarWhereInput = {
    AND?: Prisma.CardScalarWhereInput | Prisma.CardScalarWhereInput[];
    OR?: Prisma.CardScalarWhereInput[];
    NOT?: Prisma.CardScalarWhereInput | Prisma.CardScalarWhereInput[];
    id?: Prisma.UuidFilter<"Card"> | string;
    deckId?: Prisma.UuidFilter<"Card"> | string;
    front?: Prisma.StringFilter<"Card"> | string;
    back?: Prisma.StringFilter<"Card"> | string;
    createdAt?: Prisma.DateTimeFilter<"Card"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Card"> | Date | string;
};
export type CardCreateManyDeckInput = {
    id?: string;
    front: string;
    back: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CardUpdateWithoutDeckInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    front?: Prisma.StringFieldUpdateOperationsInput | string;
    back?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CardUncheckedUpdateWithoutDeckInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    front?: Prisma.StringFieldUpdateOperationsInput | string;
    back?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CardUncheckedUpdateManyWithoutDeckInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    front?: Prisma.StringFieldUpdateOperationsInput | string;
    back?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CardSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    deckId?: boolean;
    front?: boolean;
    back?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deck?: boolean | Prisma.DeckDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["card"]>;
export type CardSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    deckId?: boolean;
    front?: boolean;
    back?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deck?: boolean | Prisma.DeckDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["card"]>;
export type CardSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    deckId?: boolean;
    front?: boolean;
    back?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deck?: boolean | Prisma.DeckDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["card"]>;
export type CardSelectScalar = {
    id?: boolean;
    deckId?: boolean;
    front?: boolean;
    back?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type CardOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "deckId" | "front" | "back" | "createdAt" | "updatedAt", ExtArgs["result"]["card"]>;
export type CardInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    deck?: boolean | Prisma.DeckDefaultArgs<ExtArgs>;
};
export type CardIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    deck?: boolean | Prisma.DeckDefaultArgs<ExtArgs>;
};
export type CardIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    deck?: boolean | Prisma.DeckDefaultArgs<ExtArgs>;
};
export type $CardPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Card";
    objects: {
        deck: Prisma.$DeckPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        deckId: string;
        front: string;
        back: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["card"]>;
    composites: {};
};
export type CardGetPayload<S extends boolean | null | undefined | CardDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CardPayload, S>;
export type CardCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CardCountAggregateInputType | true;
};
export interface CardDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Card'];
        meta: {
            name: 'Card';
        };
    };
    findUnique<T extends CardFindUniqueArgs>(args: Prisma.SelectSubset<T, CardFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CardClient<runtime.Types.Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CardFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CardFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CardClient<runtime.Types.Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CardFindFirstArgs>(args?: Prisma.SelectSubset<T, CardFindFirstArgs<ExtArgs>>): Prisma.Prisma__CardClient<runtime.Types.Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CardFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CardFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CardClient<runtime.Types.Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CardFindManyArgs>(args?: Prisma.SelectSubset<T, CardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CardCreateArgs>(args: Prisma.SelectSubset<T, CardCreateArgs<ExtArgs>>): Prisma.Prisma__CardClient<runtime.Types.Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CardCreateManyArgs>(args?: Prisma.SelectSubset<T, CardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CardCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CardDeleteArgs>(args: Prisma.SelectSubset<T, CardDeleteArgs<ExtArgs>>): Prisma.Prisma__CardClient<runtime.Types.Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CardUpdateArgs>(args: Prisma.SelectSubset<T, CardUpdateArgs<ExtArgs>>): Prisma.Prisma__CardClient<runtime.Types.Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CardDeleteManyArgs>(args?: Prisma.SelectSubset<T, CardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CardUpdateManyArgs>(args: Prisma.SelectSubset<T, CardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CardUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CardUpsertArgs>(args: Prisma.SelectSubset<T, CardUpsertArgs<ExtArgs>>): Prisma.Prisma__CardClient<runtime.Types.Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CardCountArgs>(args?: Prisma.Subset<T, CardCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CardCountAggregateOutputType> : number>;
    aggregate<T extends CardAggregateArgs>(args: Prisma.Subset<T, CardAggregateArgs>): Prisma.PrismaPromise<GetCardAggregateType<T>>;
    groupBy<T extends CardGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CardGroupByArgs['orderBy'];
    } : {
        orderBy?: CardGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CardFieldRefs;
}
export interface Prisma__CardClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    deck<T extends Prisma.DeckDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DeckDefaultArgs<ExtArgs>>): Prisma.Prisma__DeckClient<runtime.Types.Result.GetResult<Prisma.$DeckPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CardFieldRefs {
    readonly id: Prisma.FieldRef<"Card", 'String'>;
    readonly deckId: Prisma.FieldRef<"Card", 'String'>;
    readonly front: Prisma.FieldRef<"Card", 'String'>;
    readonly back: Prisma.FieldRef<"Card", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Card", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Card", 'DateTime'>;
}
export type CardFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardSelect<ExtArgs> | null;
    omit?: Prisma.CardOmit<ExtArgs> | null;
    include?: Prisma.CardInclude<ExtArgs> | null;
    where: Prisma.CardWhereUniqueInput;
};
export type CardFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardSelect<ExtArgs> | null;
    omit?: Prisma.CardOmit<ExtArgs> | null;
    include?: Prisma.CardInclude<ExtArgs> | null;
    where: Prisma.CardWhereUniqueInput;
};
export type CardFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CardFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CardFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CardCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardSelect<ExtArgs> | null;
    omit?: Prisma.CardOmit<ExtArgs> | null;
    include?: Prisma.CardInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CardCreateInput, Prisma.CardUncheckedCreateInput>;
};
export type CardCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CardCreateManyInput | Prisma.CardCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CardCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CardOmit<ExtArgs> | null;
    data: Prisma.CardCreateManyInput | Prisma.CardCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CardIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CardUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardSelect<ExtArgs> | null;
    omit?: Prisma.CardOmit<ExtArgs> | null;
    include?: Prisma.CardInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CardUpdateInput, Prisma.CardUncheckedUpdateInput>;
    where: Prisma.CardWhereUniqueInput;
};
export type CardUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CardUpdateManyMutationInput, Prisma.CardUncheckedUpdateManyInput>;
    where?: Prisma.CardWhereInput;
    limit?: number;
};
export type CardUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CardOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CardUpdateManyMutationInput, Prisma.CardUncheckedUpdateManyInput>;
    where?: Prisma.CardWhereInput;
    limit?: number;
    include?: Prisma.CardIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CardUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardSelect<ExtArgs> | null;
    omit?: Prisma.CardOmit<ExtArgs> | null;
    include?: Prisma.CardInclude<ExtArgs> | null;
    where: Prisma.CardWhereUniqueInput;
    create: Prisma.XOR<Prisma.CardCreateInput, Prisma.CardUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CardUpdateInput, Prisma.CardUncheckedUpdateInput>;
};
export type CardDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardSelect<ExtArgs> | null;
    omit?: Prisma.CardOmit<ExtArgs> | null;
    include?: Prisma.CardInclude<ExtArgs> | null;
    where: Prisma.CardWhereUniqueInput;
};
export type CardDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CardWhereInput;
    limit?: number;
};
export type CardDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardSelect<ExtArgs> | null;
    omit?: Prisma.CardOmit<ExtArgs> | null;
    include?: Prisma.CardInclude<ExtArgs> | null;
};
export {};
