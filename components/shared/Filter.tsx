import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

type TFilter = {
  name: string
  value: string
}

type FilterProps = {
  filters: TFilter[]
  placeholder: string
  otherClasses?: string
  containerClasses?: string
}

const Filter = ({
  filters,
  placeholder,
  otherClasses,
  containerClasses
}: FilterProps) => {
  return (
    <div className={`relative ${containerClasses}`}>
      <Select>
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 relative  border px-5 pt-2.5 max-md:flex`}
        >
          <div className='line-clamp-1 flex-1 text-left'>
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className='text-dark500_light700 bg-white dark:bg-slate-950'>
            {filters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default Filter
