import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import Select from '../Select.vue';

describe('Select component', () => {
  const options = [
    { name: 'Option 1', code: 'opt1' },
    { name: 'Option 2', code: 'opt2' },
  ];


  test('renders label correctly', () => {
    render(Select, {
      props: { id: 'test-select', label: 'Test Label', selectOptions: options },
    });

    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();

    const select = screen.getByLabelText('Test Label');
    expect(select).toBeInTheDocument();
  });

  test('label is associated with select via id', () => {
    render(Select, {
      props: { id: 'my-select', label: 'My Label', selectOptions: options },
    });

    const select = screen.getByLabelText('My Label');
    expect(select).toHaveAttribute('id', 'my-select');
  });


  test('renders default placeholder', () => {
    render(Select, {
      props: { id: 'test-select', selectOptions: options },
    });

    const placeholder = screen.getByRole('option', {
      name: /please select an option/i,
    });
    expect(placeholder).toBeInTheDocument();
  });

  test('renders custom placeholder', () => {
    render(Select, {
      props: {
        id: 'test-select',
        selectOptions: options,
        placeholder: 'Choose one',
      },
    });

    const placeholder = screen.getByRole('option', { name: /choose one/i });
    expect(placeholder).toBeInTheDocument();
  });

 
  test('renders all provided options', () => {
    render(Select, {
      props: { id: 'test-select', selectOptions: options },
    });

    options.forEach((opt) => {
      expect(
        screen.getByRole('option', { name: opt.name }),
      ).toBeInTheDocument();
    });
  });

  test('renders only placeholder if no options provided', () => {
    render(Select, { props: { id: 'test-select' } });

    const allOptions = screen.getAllByRole('option');
    expect(allOptions).toHaveLength(1);
    expect(allOptions[0]).toHaveTextContent(/please select an option/i);
  });


  test('renders with initial modelValue', () => {
    render(Select, {
      props: { id: 'test-select', selectOptions: options, modelValue: 'opt1' },
    });

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('opt1');
  });

  test('emits update:modelValue when selection changes', async () => {
    const user = userEvent.setup();
    const { emitted } = render(Select, {
      props: { id: 'test-select', selectOptions: options },
    });

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'opt2');

    const updates = emitted()['update:modelValue'];
    expect(updates).toBeTruthy();
    expect(updates![0]).toEqual(['opt2']);
  });

  test('can select an option', async () => {
    const user = userEvent.setup();
    render(Select, {
      props: { id: 'test-select', selectOptions: options },
    });

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'opt2');

    expect(select).toHaveValue('opt2');
  });


  test('disabled select cannot be changed', async () => {
    const user = userEvent.setup();
    const { emitted } = render(Select, {
      props: { id: 'test-select', selectOptions: options, disabled: true },
    });

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();

    // Placeholder is still rendered
    const placeholder = screen.getByRole('option', {
      name: /please select an option/i,
    });
    expect(placeholder).toBeInTheDocument();

    // Attempt to change value
    await user.selectOptions(select, 'opt1');

    // No events should be emitted
    expect(emitted()['update:modelValue']).toBeUndefined();
  });
});
