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
  otherClasses?: string
  containerClasses?: string
}

const Filter = ({ filters, otherClasses, containerClasses }: FilterProps) => {
  return (
    <div className={`relative ${containerClasses}`}>
      <Select>
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 relative  border px-5 pt-2.5 max-md:flex`}
        >
          <div className='line-clamp-1 flex-1 text-left'>
            <SelectValue placeholder='Select a filter' />
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
