import * as s from 'superstruct'

const TAGS = [
  'FASHION',
  'BEAUTY',
  'SPORTS',
  'ELECTRONICS',
  'HOME_INTERIOR',
  'HOUSEHOLD_SUPPLIES',
  'KITCHENWARE',
]

// 중고마켓(Product)
export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 10),
  description: s.string(),
  price: s.min(s.number(), 0),
  tags: s.enums(TAGS)
})

export const PatchProduct = s.partial(CreateProduct)


// 자유게시판(Article)
export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 30),
  content: s.string()
})

export const PatchArticle = s.partial(CreateArticle)


// 댓글(Comment)
export const CreateComment = s.object({
  content: s.string()
})

export const PatchComment = s.partial(CreateComment)
