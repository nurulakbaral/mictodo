```jsx
// InputBase (Native)
<form onSubmit={onSubmit(handleSubmit)}>
  <div
    onFocus={handlePlaceholderFocus}
    onBlur={handlePlaceholderBlur}
    className='mt-40 w-5/6 mx-auto h-12 flex items-center relative'
  >
    {placeholder && (
      <div className='flex items-center absolute left-4 pointer-events-none'>
        <PlusIcon className='w-6 h-6 mr-4 text-gray-700' />
        <h6 className='text-gray-700 text-base'>Add a task</h6>
      </div>
    )}
    <InputBase className='font-poppins' autoComplete='off' {...register('task')} />
  </div>
</form>
```

```jsx
<TextFieldTaskGroup
  isPriority={isPriority}
  boxIconProps={{
    onClick: handleIsPriority,
  }}
/>
```
