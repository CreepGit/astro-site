import { defineDb, defineTable, column } from 'astro:db';

export const Message = defineTable({
  columns: {
    author: column.text(),
    message: column.text()
  }
})

export default defineDb({
  tables: { Message }
});
